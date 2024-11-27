const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  okCode,
  createdCode,
  badRequestCode,
  notFoundCode,
  internalServerError,
  invalidCredentialsCode,
} = require("../utils/errors");

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(badRequestCode)
      .send({ message: "Email and password are required." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(invalidCredentialsCode).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((data) => {
      const user = {
        _id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      };
      if (!user) {
        return res.status(notFoundCode).send({ message: "err.message" });
      }
      return res.status(okCode).send(user);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

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
    .then((user) => {
      const { password: UserPassword, ...userWithoutPassword } =
        user.toObject();
      return res.status(201).send(userWithoutPassword);
    })
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
  next();
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((data) => {
      const updatedUser = {
        _id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      };
      if (!updatedUser) {
        return res.status(notFoundCode).send({ message: "user not found" });
      }
      return res.status(okCode).send(updatedUser);
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

module.exports = { getCurrentUser, createUser, updateProfile, login };
