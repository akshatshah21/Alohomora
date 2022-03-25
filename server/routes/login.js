const express = require("express");
const router = express.Router();

const User = require("../model/User.js");

require("dotenv").config();
const NUM_IMAGES_PER_SET = process.env.NUM_IMAGES_PER_SET;
const totalIterations = process.env.TOTAL_ITERATIONS;

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
    const email = req.body.email;
    User.findOne({ email: email }).then((user) => {
      if (user) {
        const iterationNum = req.body.interationNum;
        if (iterationNum === 0) {
          res.status(200).json({ images: user.firstSet });
        } else if (iterationNum === totalIterations) {
          const passwordHash = req.body.passwordHash;
          if (passwordHash === user.passwordHash) {
            res.status(200).json({ msg: "login successfull" });
          } else {
            res.status(200).json({ msg: "login unsuccessfull" });
          }
        } else {
          const key = req.body.key;
          const encryptedImage = user.images[iterationNum - 1];

          let imageUrl =
            "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixid=MnwzMXMzMTl8MHwxfHNlYXJjaHwxfHxjYXR8ZW58MHwxfHx8MTY0ODIwMjM2OA&ixlib=rb-1.2.1&crop=faces&fit=crop&h=250&w=250";
          let imageCount = NUM_IMAGES_PER_SET;
          //let imageUrl = decryptImage(encryptedImage,key);
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
                shuffleArray(imageLinks);
                res.status(200).json({ images: imageLinks });
              } else {
                res
                  .status(500)
                  .json({ msg: "couldn't get images from unsplash" });
              }
            });
        }
      } else {
        res.status(200).json({ msg: "user does not exists" });
      }
    });
  });
  return router;
};
