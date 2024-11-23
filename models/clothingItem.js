const mongoose = require("mongoose");
const validator = require("validator");
const user = require("./user");

const clothingItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlngth: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "Please enter a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user, // link to item author's model of the ObjectId type
    required: true,
  },
  likes: {
    b: Boolean,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: [],
    // a list of users who liked the item
    // an ObjectId array with a reference to the user modal
    // (empty by default)
  },
  createdAt: {
    // item creation date
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItems", clothingItemsSchema);
