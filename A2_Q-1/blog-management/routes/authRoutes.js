const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  register,
  loginUser,
  getProfile,
  uploadProfilePicture,
  browserRegister,
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

router.post(
  "/profile-picture",
  protect,
  upload.single("profilePicture"),
  uploadProfilePicture,
);

router.get("/register", (req, res) => {
  res.render("register", {
    error: null,
  });
});

router.post("/register", browserRegister);

module.exports = router;
