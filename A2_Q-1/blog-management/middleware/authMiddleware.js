const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // For Browser/EJS
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // For Postman/API
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token
    if (!token) {
      // Browser request
      if (req.accepts("html")) {
        return res.redirect("/login");
      }

      // API/Postman request
      return res.status(401).json({
        message: "Not authorized. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.redirect("/login");
    }

    next();
  } catch (error) {
    console.log("Authentication Error:", error.message);

    res.clearCookie("token");

    if (req.accepts("html")) {
      return res.redirect("/login");
    }

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = protect;
