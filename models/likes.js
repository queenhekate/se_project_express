const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  b: Boolean,
});

module.exports = mongoose.model("user", likesSchema);
