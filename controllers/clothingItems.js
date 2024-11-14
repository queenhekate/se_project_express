const ClothingItem = require("../models/clothingItems");
const {
  BAD_REQUEST_STATUS_CODE,
  REQUEST_NOT_FOUND,
  DEFAULT_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .orFail()
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ messge: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .orFail()
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Get Items failed", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Get Items failed", e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((e) => {
      res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Delete Item failed", e });
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((e) => {
      res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Like Item failed", e });
    });

const unlikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((e) => {
      res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Dislike Item failed", e });
    });

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
module.exports.createItem = (req, res) => {
  console.log(req.user._id); // _id will become accessible
};
