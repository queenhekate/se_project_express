const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  okCode,
  createdCode,
  badRequestCode,
  notFoundCode,
  internalServerError,
  forbidden,
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
      res.status(okCode).json(items);
    })
    .catch(() => {
      res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!/^[0-9a-fA-F]{24}$/.test(itemId)) {
    return res.status(badRequestCode).json({ message: "bad request" });
  }

  return ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res.status(forbidden).send({ message: "delete item forbidden" });
      }
      return item
        .deleteOne()
        .then(() =>
          res.status(okCode).send({ message: "Successfully deleted" })
        );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(badRequestCode).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundCode).send({ message: err.message });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(badRequestCode).send({ message: "Invalid data" });
  }

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((likes) => res.status(okCode).send(likes))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundCode).send({ message: err.message });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(badRequestCode).send({ message: "Invalid data" });
  }
  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((likes) => res.status(okCode).send(likes))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundCode).send({ message: err.message });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
