const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const auth = require("../middlewares/auth");
const NotFoundError = require("../errors/not-found-err");

router.use("/items", itemRouter);

router.use(auth);
router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
