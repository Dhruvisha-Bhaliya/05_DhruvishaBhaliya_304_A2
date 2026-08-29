const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  browserLogin,
  browserRegister,
} = require("../controllers/authController");

// =====================================
// Auth View Routes
// =====================================
router.get("/login", (req, res) => res.render("login", { error: null }));
router.post("/login", browserLogin);

router.get("/register", (req, res) => res.render("register", { error: null }));
router.post("/register", upload.single("profilePicture"), browserRegister);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

// =====================================
// READ - Published Posts Page
// =====================================
router.get("/posts", async (req, res, next) => {
  try {
    const posts = await Post.find({ published: true })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.render("posts", { posts });
  } catch (error) {
    next(error);
  }
});

// =====================================
// READ - Dashboard (User Posts)
// =====================================
router.get("/dashboard", protect, async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    res.render("dashboard", { user: req.user, posts });
  } catch (error) {
    next(error);
  }
});

// =====================================
// CREATE - Render & Submit New Post
// =====================================
router.get("/posts/new", protect, (req, res) => {
  res.render("createPost", { error: null });
});

router.post(
  "/posts/new",
  protect,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { title, content, tags, published } = req.body;

      let imagePath = null;
      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
      }

      await Post.create({
        title,
        content,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        published: published === "on" || published === true,
        image: imagePath,
        author: req.user._id,
      });

      res.redirect("/dashboard");
    } catch (error) {
      res.render("createPost", { error: error.message });
    }
  },
);

// =====================================
// UPDATE - Render & Submit Edit Post
// =====================================
router.get("/posts/:id/edit", protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).send("Post not found");
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).send("Not authorized");
    }

    res.render("editPost", { post, error: null });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/posts/:id/edit",
  protect,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) return res.status(404).send("Post not found");
      if (
        post.author.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).send("Not authorized");
      }

      const { title, content, tags, published } = req.body;

      post.title = title;
      post.content = content;
      post.tags = tags ? tags.split(",").map((tag) => tag.trim()) : [];
      post.published = published === "on" || published === true;

      if (req.file) {
        post.image = `/uploads/${req.file.filename}`;
      }

      await post.save();
      res.redirect("/dashboard");
    } catch (error) {
      res.render("editPost", { post: req.body, error: error.message });
    }
  },
);

// =====================================
// Logout Route
// =====================================
router.get("/logout", (req, res) => {
  // Clear the authentication cookie
  res.clearCookie("token");

  // Redirect to login page
  res.redirect("/login");
});
module.exports = router;
