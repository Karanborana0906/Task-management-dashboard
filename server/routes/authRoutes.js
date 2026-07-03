// routes/authRoutes.js
// Authentication API routes with input validation

const express = require("express");
const { body } = require("express-validator");
const { register, login, getProfile, logout, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const router = express.Router();

// ── Validation chains ─────────────────────────────────────────────────────────

/** Registration validators */
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

/** Login validators */
const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/auth/register
router.post("/register", registerValidation, validate, register);

// POST /api/auth/login
router.post("/login", loginValidation, validate, login);

// GET /api/auth/me  (protected)
router.get("/me", protect, getProfile);

// POST /api/auth/logout  (protected)
router.post("/logout", protect, logout);

// PUT /api/auth/profile  (protected)
router.put("/profile", protect, updateProfile);

module.exports = router;
