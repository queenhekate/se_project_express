const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  okCode,
  createdCode,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(createdCode).json({ data: item }))
    .catch((err) => {
      if (err.name === "BadRequestError") {
        next(new BadRequestError("item is in invalid format"));
      }
      next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(okCode).json(items);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!/^[0-9a-fA-F]{24}$/.test(itemId)) {
    return res.status(BadRequestError).json({ message: "bad request" });
  }

  return ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(ForbiddenError)
          .send({ message: "delete item forbidden" });
      }
      return item
        .deleteOne()
        .then(() =>
          res.status(okCode).send({ message: "Successfully deleted" })
        );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("item is in invalid format"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("item not found"));
      }
      next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BadRequestError).send({ message: "Invalid data" });
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
        next(new NotFoundError("item not found"));
      }
      next(err);
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BadRequestError).send({ message: "Invalid data" });
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
        next(new NotFoundError("item not found"));
      }
      next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
