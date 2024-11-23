const router = require("express").Router();
const { badRequestCode } = require("../utils/errors");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.statusCode(badRequestCode).send({ message: "Router not found" });
});

module.exports = router;
