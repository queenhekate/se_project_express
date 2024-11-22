const router = require("express").Router();
const {
  BAD_REQUEST_STATUS_CODE,
  REQUEST_NOT_FOUND,
  DEFAULT_ERROR,
} = require("../utils/errors");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.statusCode(BAD_REQUEST_STATUS_CODE).send({ message: "Router not found" });
});

module.exports = router;
