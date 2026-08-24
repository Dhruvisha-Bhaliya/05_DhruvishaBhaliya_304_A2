const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.cookies?.token;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

  if (!token) {
    if (req.accepts("html")) return res.redirect("/login");
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (req.accepts("html")) return res.redirect("/login");
    return res.status(403).json({ success: false, message: "Invalid token." });
  }
};

module.exports = verifyToken;
