const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

const auth = require("../middlewares/auth");

const { notFoundCode } = require("../utils/errors");

router.use("/items", itemRouter);

router.use(auth);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(notFoundCode).send({ message: "Router not found" });
});

module.exports = router;
