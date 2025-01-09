const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-error");
const { okCode } = require("../utils/errors");

const login = (req, res, next) => {
  const { email, password } = req.body;
  // console.log(">> LOGIN", { email, password });

  if (!email || !password) {
    throw new BadRequestError("Email and password are required.");
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
        next(new UnauthorizedError("email or password incorrect"));
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((data) => {
      if (!data) {
        throw new NotFoundError("User not found");
      }
      const user = {
        _id: data.id,
        email: data.email,
        password: data.password,
        name: data.name,
        avatar: data.avatar,
      };
      return res.status(okCode).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required.");
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        avatar,
      }).then((user) => {
        const userCopy = user.toObject();
        delete userCopy.password;
        return res.status(201).send(userCopy);
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("Email already exists."));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("item is in invalid format"));
      }
      next(err);
    });
};

const updateProfile = (req, res, next) => {
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
        avatar: data.avatar,
      };
      if (!updatedUser) {
        throw new NotFoundError("user not found");
      }
      return res.status(okCode).send(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("item is in invalid format"));
      }
      next(err);
    });
};

module.exports = { getCurrentUser, createUser, updateProfile, login };
