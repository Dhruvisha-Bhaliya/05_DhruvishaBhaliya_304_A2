const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  uploadPostImage,
} = require("../controllers/postController");

// Create post
router.post("/", protect, createPost);

// Get logged-in user's posts
router.get("/", protect, getPosts);

// Get single post
router.get("/:id", protect, getPostById);

// Update post
router.put("/:id", protect, updatePost);

// Delete post
router.delete("/:id", protect, deletePost);

// Upload featured image
router.post("/:id/image", protect, upload.single("image"), uploadPostImage);

module.exports = router;
