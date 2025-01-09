const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", auth, validateCardBody, createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", auth, validateId, deleteItem);

// Like
router.put("/:itemId/likes", auth, validateId, likeItem);

// Unlike
router.delete("/:itemId/likes", auth, validateId, unlikeItem);

module.exports = router;
