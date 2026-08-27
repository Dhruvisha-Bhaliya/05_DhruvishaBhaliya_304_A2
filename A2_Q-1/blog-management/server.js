const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const viewRoutes = require("./routes/viewRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// ===============================
// Body Parsers
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Cookie Parser
// IMPORTANT: Must be before routes
// ===============================
app.use(cookieParser());

// ===============================
// Static Files
// ===============================
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// EJS Configuration
// ===============================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===============================
// API Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ===============================
// EJS View Routes
// ===============================
app.use("/", viewRoutes);

// ===============================
// Error Middleware
// IMPORTANT: Must be last
// ===============================
app.use(errorMiddleware);

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB Error:", error.message));

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
