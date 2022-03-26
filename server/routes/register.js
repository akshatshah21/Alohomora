const express = require("express");
const router = express.Router();

const User = require("../model/User.js");

require("dotenv").config();
const NUM_IMAGES_PER_SET = process.env.NUM_IMAGES_PER_SET;

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
  // @route POST api/register
  // @desc Register user
  // @access Public
  /*
  name
  email
  images (list of a,b,c,d)
  passwordHash
  */
  router.post("/", (req, res) => {
    const userData = req.body;
    User.findOne({ email: userData.email })
      .then((user) => {
        if (user) {
          return res.status(200).json({ msg: "user already exists" });
        }
        let imageLinks = [];
        unsplash.photos
          .getRandom({
            count: NUM_IMAGES_PER_SET - 1,
          })
          .then((result) => {
            console.log(result.type);
            if (result.type === "success") {
              const images = result.response;
              for (let i = 0; i < NUM_IMAGES_PER_SET - 1; i++) {
                let newLink = images[i].urls.raw;
                newLink += "&crop=faces&fit=crop&h=250&w=250";
                imageLinks.push(newLink);
              }

              console.log("userdata", userData);

              imageLinks.push(userData.images[0]);
              shuffleArray(imageLinks);
              console.log(imageLinks);
              const newUser = new User({
                name: userData.name,
                email: userData.email,
                firstSet: imageLinks,
                images: userData.images.slice(1, userData.images.length),
                captions: userData.captions,
                passwordHash: userData.passwordHash,
              });
              newUser
                .save()
                .then(() => {
                  console.log(userData.captions);
                  console.log("new user saved");
                  return res.status(200).json({ msg: "registeration successful" });
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(500).json({ msg: "couldn't save new user" });
                });
            } else {
              return res
                .status(500)
                .json({ msg: "couldn't get images from unsplash" });
            }
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ msg: "failed at searching for duplicate user" });
      });
  });
  return router;
};
