// controllers/authController.js
// Handles all authentication-related logic: register, login, profile

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // ── Check if user already exists ─────────────────────────────────────
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // ── Create new user (password hashed in pre-save hook) ────────────────
    const user = await User.create({ name, email, password });

    // ── Generate JWT token ────────────────────────────────────────────────
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login a user and return JWT
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ── Find user and explicitly include password field ───────────────────
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    // ── Validate credentials — generic message to prevent user enumeration ─
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ── Generate JWT token ────────────────────────────────────────────────
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Logout user (client-side token removal — informational endpoint)
// @route   POST /api/auth/logout
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    // JWT is stateless; logout is handled client-side by removing the token.
    // This endpoint serves as a clean signal for the frontend.
    res.status(200).json({
      success: true,
      message:
        "Logged out successfully. Please remove the token from client storage.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, logout };
