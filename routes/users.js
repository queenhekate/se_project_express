const router = require("express").Router();

const { getCurrentUser, updateProfile } = require("../controllers/users");

const { updateUserInfo } = require("../middlewares/validation");

router.get("/me", getCurrentUser);

router.patch("/me", updateUserInfo, updateProfile);

module.exports = router;
