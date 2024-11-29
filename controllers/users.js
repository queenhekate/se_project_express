const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  okCode,
  conflictCode,
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
      if (
        err.message.includes("Incorrect email") ||
        err.message.includes("Incorrect password")
      ) {
        return res
          .status(invalidCredentialsCode)
          .send({ message: err.message });
      }
      return res
        .status(internalServerError)
        .send({ message: "Internal Server Error" });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((data) => {
      if (!data) {
        return res.status(notFoundCode).send({ message: "User not found" });
      }
      const user = {
        _id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      };
      return res.status(okCode).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.message.includes("Unauthorized")) {
        return res
          .status(invalidCredentialsCode)
          .send({ message: "Unauthorized: Invalid or expired token" });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password) {
    return res
      .status(badRequestCode)
      .send({ message: "Email and password are required." });
  }

  return User.findOne({ email: email.toLowerCase() }).then((existingUser) => {
    if (existingUser) {
      return res.status(conflictCode).send({
        message: "The user with the provided email already exists",
      });
    }

    return bcrypt
      .hash(password, 10)
      .then((hashedPassword) =>
        User.create({ name, avatar, email, password: hashedPassword }).then(
          (user) => {
            const { password: UserPassword, ...userWithoutPassword } =
              user.toObject();
            return res.status(201).send(userWithoutPassword);
          }
        )
      )
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) {
          return res.status(conflictCode).send({
            message: "Email already exists",
          });
        }
        if (err.name === "ValidationError") {
          return res.status(badRequestCode).send({ message: err.message });
        }
        return res
          .status(internalServerError)
          .send({ message: "Internal server error" });
      });
  });
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
