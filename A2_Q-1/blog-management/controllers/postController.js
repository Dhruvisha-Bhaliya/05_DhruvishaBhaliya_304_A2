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
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Server-side authorization check
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to edit this post" });
    }

    // Process uploaded file path if replaced
    let imagePath = post.image;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const { title, content, tags, published } = req.body;

    post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        tags:
          typeof tags === "string"
            ? tags.split(",").map((t) => t.trim())
            : tags,
        published: published === "true" || published === true,
        image: imagePath,
      },
      { new: true, runValidators: true },
    );

    res.json({ success: true, post });
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
