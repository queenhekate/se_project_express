const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/items", createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:id", updateItem);

// Delete
router.delete("/:id", deleteItem);

// Like
router.put("/:id/likes", likeItem);

// Unlike
router.delete("/:id/likes", unlikeItem);

module.exports = router;
