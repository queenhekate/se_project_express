const router = require("express").Router();

const { likeItem, unlikeItem } = require("../controllers/likes");

// Like
router.put("/:itemId", likeItem);

// Unlike
router.delete("/:itemId", unlikeItem);

module.exports = router;
