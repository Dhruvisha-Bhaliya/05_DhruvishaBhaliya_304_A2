const Post = require("../models/Post");
const fs = require("fs");
const path = require("path");

// Create a new blog post
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags, published } = req.body;

    // Handle tags whether they come as a string or array
    let formattedTags = [];

    if (Array.isArray(tags)) {
      formattedTags = tags;
    } else if (typeof tags === "string") {
      formattedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    const post = await Post.create({
      title,
      content,
      tags: formattedTags,
      published: published === true || published === "true",
      author: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in user's posts
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({
      author: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// Get single post
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this post",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Update post
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check ownership
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    // Important: prevent req.body undefined error
    const { title, content, tags, published } = req.body || {};

    // Update text fields
    if (title !== undefined) {
      post.title = title;
    }

    if (content !== undefined) {
      post.content = content;
    }

    // Handle tags
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        post.tags = tags;
      } else if (typeof tags === "string") {
        post.tags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }
    }

    // Handle published checkbox
    post.published =
      published === "on" || published === true || published === "true";

    // If a new image is uploaded
    if (req.file) {
      post.image = `/uploads/${req.file.filename}`;
    }

    await post.save();

    // Browser / EJS request
    if (req.accepts("html")) {
      return res.redirect("/dashboard");
    }

    // API / Postman request
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Delete post
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    // Delete associated image file
    if (post.featuredImage) {
      const imagePath = path.join(__dirname, "..", post.featuredImage);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Upload or replace featured image
const uploadPostImage = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check ownership or admin
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to upload an image for this post",
      });
    }

    // Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    // Save image path in MongoDB
    post.image = `/uploads/${req.file.filename}`;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  uploadPostImage,
};
