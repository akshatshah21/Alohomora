const express = require("express");
const router = express.Router();

const User = require("../model/User.js");

// @route POST api/register
// @desc Register user
// @access Public
router.post("/", (req, res) => {
  const userData = req.body;
  User.findOne({ email: userData.email })
    .then((user) => {
      if (user) {
        res.status(200).json({ msg: "user already exists" });
      }
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        firstSet: userData.firstSet,
        images: userData.images,
        passwordHash: userData.passwordHash,
      });
      newUser
        .save()
        .then(() => {
          console.log("new user saved");
          res.status(200).json({ msg: "registeration successful" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ msg: "couldn't save new user" });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ msg: "failed at searching for duplicate user" });
    });
});

module.exports = router;
