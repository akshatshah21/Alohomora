const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstSet: {
    type: [String],
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  captions: {
    type: [String]
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
