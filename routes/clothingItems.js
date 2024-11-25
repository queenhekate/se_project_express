const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", deleteItem);

// Like
router.put("/:itemId/likes", likeItem);

// Unlike
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
