const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  okCode,
  createdCode,
  // noContentCode,
  badRequestCode,
  // invalidCredentialsCode,
  // forbidden,
  notFoundCode,
  // conflictCode,
  internalServerError,
} = require("../utils/errors");

const createItem = (req, res) => {
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(createdCode).json({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(badRequestCode).json({ message: err.message });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(okCode).send(items);
    })
    .catch((err) => {
      res.status(internalServerError).send({ message: err.message });
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
//     .orFail()
//     .then((item) => {
//       res.status(okCode).send({ data: item });
//     })
//     .catch((err) => {
//       console.log(err.name);
//       if (err.name === "ValidationError") {
//         return res
//           .status(badRequestCode)
//           .send({ message: "Get Items failed", err });
//       }
//       next(err);
//       return res.status(internalServerError).send({ message: err.message });
//     });
// };

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(badRequestCode).send({ message: "Invalid data" });
  }
  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then(() => res.status(okCode).send({ message: "Deletion successful" }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(badRequestCode).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundCode).send({ message: err.message });
      }
      return res.status(internalServerError).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(badRequestCode).send({ message: "Invalid data" });
  }

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((likes) => res.status(okCode).send(likes))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundCode).send({ message: err.message });
      }
      // next(err);
      return res
        .status(internalServerError)
        .send({ message: "Like Item failed", err });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(badRequestCode).send({ message: "Invalid data" });
  }
  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((likes) => res.status(okCode).send(likes))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundCode).send({ message: err.message });
      }
      // next(err);
      return res
        .status(internalServerError)
        .send({ message: "Dislike Item failed", err });
    });
};

module.exports = {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
