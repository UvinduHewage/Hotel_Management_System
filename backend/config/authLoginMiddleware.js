const jwt = require("jsonwebtoken");
const Staff = require("../models/Uvindu_models/User");
require("dotenv").config();


exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Staff.findById(decoded.id).select("-password"); 
    if (!req.user) {
      return res.status(401).json({ message: "User not found." });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token. Please log in again." });
  }
};

// Middleware to allow only admin access
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
