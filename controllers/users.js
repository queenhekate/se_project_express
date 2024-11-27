const User = require("../models/user");
const {
  okCode,
  createdCode,
  badRequestCode,
  notFoundCode,
  internalServerError,
  invalidCredentialsCode,
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

const createUser = (req, res, next) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password) {
    res
      .status(badRequestCode)
      .send({ message: "Email and password are required." });
  }

  User.findOne({ email: email.toLowerCase() })
    .select("+password")
    .then((user) => {
      if (user) {
        const error = new Error(
          "The user with the provided email already exists"
        );
        error.statusCode = invalidCredentialsCode;
        throw error;
      }

      return bcrypt.hash(password, 10);
    })

    .then((hash) =>
      User.create({ name, avatar, email, password: hash }).then((user) => {
        res.status(createdCode).send({
          name: user.name,
          avatar: user.avatar,
          _id: user._id,
        });
      })
    )
    .catch((err) => {
      if (err.statusCode === invalidCredentialsCode) {
        return res
          .status(invalidCredentialsCode)
          .send({ message: "User already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(badRequestCode).send({ message: "Invalid user" });
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
