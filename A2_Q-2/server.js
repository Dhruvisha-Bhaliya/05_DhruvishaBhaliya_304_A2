const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");

const app = express();

app.use(express.json());

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
console.log("MongoDB connected successfully");
})
.catch((error) => {
console.error("MongoDB connection error:", error.message);
});

app.post("/api/auth/register", async (req, res) => {
try {
const { name, email, password } = req.body;

if (!name || !email || !password) {
  return res.status(400).json({
    success: false,
    message: "Name, email and password are required"
  });
}

const existingUser = await User.findOne({ email });

if (existingUser) {
  return res.status(409).json({
    success: false,
    message: "User already exists"
  });
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
  name,
  email,
  password: hashedPassword
});

return res.status(201).json({
  success: true,
  message: "User registered successfully",
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

} catch (error) {
console.error("Registration Error:", error);

return res.status(500).json({
  success: false,
  message: "Registration failed",
  error: error.message
});

}
});

app.post("/api/auth/login", async (req, res) => {
try {
const { email, password } = req.body;

if (!email || !password) {
  return res.status(400).json({
    success: false,
    message: "Email and password are required"
  });
}

const user = await User.findOne({ email });

if (!user) {
  return res.status(401).json({
    success: false,
    message: "Invalid email or password"
  });
}

const isPasswordCorrect = await bcrypt.compare(
  password,
  user.password
);

if (!isPasswordCorrect) {
  return res.status(401).json({
    success: false,
    message: "Invalid email or password"
  });
}

return res.status(200).json({
  success: true,
  message: "Login successful",
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

} catch (error) {
console.error("Login Error:", error);

return res.status(500).json({
  success: false,
  message: "Login failed",
  error: error.message
});

}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});