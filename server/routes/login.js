const express = require("express");
const router = express.Router();

const User = require("../model/User.js");

const totalIterations = 6;

// @route POST api/login
// @desc login user
// @access Public
router.post("/", (req, res) => {
  const email = req.body.email;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      const iterationNum = req.body.interationNum;
      if (iterationNum === 0) {
        res.status(200).json({ images: user.images });
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
        //decryptImage(encryptedImage,key);
        //function to get 8/9 random images.
        res.status(200).json({ msg: "login done" });
      }
    } else {
      res.status(200).json({ msg: "user does not exists" });
    }
  });
});
