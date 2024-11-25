const User = require("../models/user");
const {
  okCode,
  createdCode,
  badRequestCode,
  notFoundCode,
  internalServerError,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(okCode).send(users);
    })
    .catch((err) => {
      console.error(err);
      // next(err);
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

// POST /users

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  return User.create({ name, avatar })
    .then((user) => {
      res.status(createdCode).send({
        name: user.name,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequestCode).send({ message: err.message });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

// GET /:userId

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      const { avatar, name } = user;
      res.status(okCode).send({ avatar, name });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundCode).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(badRequestCode).send({ message: err.message });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getUser };
