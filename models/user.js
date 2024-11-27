const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid E-mail",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isStrongPassword(value);
      },
      message: "You must enter a strong password",
    },
  },
});

module.exports = mongoose.model("user", userSchema);
