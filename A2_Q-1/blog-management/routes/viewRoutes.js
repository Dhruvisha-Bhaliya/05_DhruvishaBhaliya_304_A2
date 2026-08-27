const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const protect = require("../middleware/authMiddleware");
const { browserLogin } = require("../controllers/authController");

// =====================================
// Login Page
// =====================================
router.get("/login", (req, res) => {
  res.render("login", {
    error: null,
  });
});

// =====================================
// Login Form Submit
// =====================================
router.post("/login", browserLogin);

// =====================================
// Published Posts Page
// =====================================
router.get("/posts", async (req, res, next) => {
  try {
    const posts = await Post.find({ published: true })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.render("posts", {
      posts,
    });
  } catch (error) {
    next(error);
  }
});

// =====================================
// Protected Dashboard
// =====================================
router.get("/dashboard", protect, async (req, res, next) => {
  try {
    const posts = await Post.find({
      author: req.user._id,
    }).sort({ createdAt: -1 });

    res.render("dashboard", {
      user: req.user,
      posts,
    });
  } catch (error) {
    next(error);
  }
});

// =====================================
// Edit Post Page
// =====================================
router.get("/posts/:id/edit", protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Only author or admin can edit
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).send("Not authorized");
    }

    res.render("editPost", {
      post,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
