const User = require("../models/user");
const {
  okCode,
  createdCode,
  noContentCode,
  badRequestCode,
  invalidCredentialsCode,
  forbidden,
  notFoundCode,
  conflictCode,
  internalServerError,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res, next) => {
  User.find({})
    .orFail()
    .then((users) => {
      res.status(okCode).send(users);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundCode).send({ message: err.message });
      }
      next(err);
      return res.status(internalServerError).send({ message: err.message });
    });
};

// POST /users

const createUser = (req, res, next) => {
  const { _id, name, avatar } = req.body;

  return User.create({ _id, name, avatar })
    .then((user) => {
      res.status(createdCode).send({
        name: user.name,
        avatar: user.avatar,
        id: user._id,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequestCode).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundCode).send({ message: err.message });
      }
      next(err);
      return res.status(internalServerError).send({ message: err.message });
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.name = "DocumentNotFoundError";
      throw error;
    })
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
      next(err);
      return res.status(internalServerError).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
