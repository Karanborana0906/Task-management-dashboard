// middleware/authMiddleware.js
// JWT Authentication middleware — protects private routes

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware: protect
 * Validates the Bearer JWT token from Authorization header.
 * Attaches the authenticated user to req.user on success.
 */
const protect = async (req, res, next) => {
  let token;

  // ── Extract token from Authorization header ──────────────────────────────
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ── No token provided ────────────────────────────────────────────────────
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No token provided.",
    });
  }

  try {
    // ── Verify token ─────────────────────────────────────────────────────
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ── Fetch user from DB, excluding password ───────────────────────────
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. User no longer exists.",
      });
    }

    // ── Attach user to request object ────────────────────────────────────
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token has expired.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized.",
    });
  }
};

module.exports = { protect };
