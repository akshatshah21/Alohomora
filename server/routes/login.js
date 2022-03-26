const express = require("express");
const router = express.Router();

const User = require("../model/User.js");
const decryptImage = require("../utils/decryption");

require("dotenv").config();
const NUM_IMAGES_PER_SET = Number(process.env.NUM_IMAGES_PER_SET);
const TOTAL_ITERATIONS = Number(process.env.TOTAL_ITERATIONS);

const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));

    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

module.exports = (unsplash) => {
  // @route POST api/login
  // @desc login user
  // @access Public
  router.post("/", (req, res) => {
    /*
    email
    iterationNum
    passwordHash
    key
    */
    const email = req.body.email;
    User.findOne({ email: email }).then((user) => {
      if (user) {
        const iterationNum = req.body.iterationNum;
        console.log(iterationNum);
        if (iterationNum === 0) {
          return res.status(200).json({ images: user.firstSet, caption: user.captions[0] });
        } else if (iterationNum === TOTAL_ITERATIONS) {

          console.log("last");

          const passwordHash = req.body.passwordHash;
          if (passwordHash === user.passwordHash) {
            return res.status(200).json({ msg: "login successful" });
          } else {
            return res.status(401).json({ msg: "login unsuccessful" });
          }
        } else {
          const key = req.body.key;
          const encryptedImage = user.images[iterationNum - 1];
          const caption = user.captions[iterationNum]

          let imageCount = NUM_IMAGES_PER_SET;
          console.log("key", key);
          console.log("image", encryptedImage);
          let imageUrl = "";
          try {
            imageUrl = decryptImage(encryptedImage, key);
          } catch (error) {
            imageUrl = encryptedImage;
            console.log("couldn't decrypt");
          }
          fetch(imageUrl)
            .then(() => {
              imageCount -= 1;
            })
            .catch(() => {
              console.log("not right image");
            });

          //8/9 random images.
          unsplash.photos
            .getRandom({
              count: imageCount,
            })
            .then((result) => {
              if (result.type == "success") {
                const images = result.response;
                let imageLinks = [];
                for (let i = 0; i < imageCount; i++) {
                  let newLink = images[i].urls.raw;
                  newLink += "&crop=faces&fit=crop&h=250&w=250";
                  imageLinks.push(newLink);
                }
                if (imageCount === NUM_IMAGES_PER_SET - 1)
                  imageLinks.push(imageUrl);
                shuffleArray(imageLinks);
                return res.status(200).json({ images: imageLinks, caption: caption });
              } else {
                return res
                  .status(500)
                  .json({ msg: "couldn't get images from unsplash" });
              }
            });
        }
      } else {
        return res.status(404).json({ msg: "user does not exists" });
      }
    });
  });
  return router;
};
