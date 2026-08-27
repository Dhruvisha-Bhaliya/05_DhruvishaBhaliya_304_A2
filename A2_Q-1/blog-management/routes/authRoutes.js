const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  register,
  loginUser,
  getProfile,
} = require("../controllers/authController");

// Rate limiter for register and login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Register
router.post("/register", authLimiter, register);

// Login
router.post("/login", authLimiter, loginUser);

// Get logged-in user profile
router.get("/profile", protect, getProfile);

module.exports = router;
