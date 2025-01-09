const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateCardBody } = require("../middlewares/validation");

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
router.delete("/:itemId", auth, validateCardBody, deleteItem);

// Like
router.put("/:itemId/likes", auth, validateCardBody, likeItem);

// Unlike
router.delete("/:itemId/likes", auth, validateCardBody, unlikeItem);

module.exports = router;
