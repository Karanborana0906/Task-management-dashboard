// routes/taskRoutes.js
// Task CRUD API routes — all protected by JWT authentication

const express = require("express");
const { body, param } = require("express-validator");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const router = express.Router();

// ── All task routes require authentication ────────────────────────────────────
router.use(protect);

// ── Validation chains ─────────────────────────────────────────────────────────

/** Validator for MongoDB ObjectId in URL params */
const idParamValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid task ID format"),
];

/** Create task validators */
const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be one of: Low, Medium, High"),

  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be one of: Pending, In Progress, Completed"),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),
];

/** Update task validators (all fields optional) */
const updateTaskValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be one of: Low, Medium, High"),

  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be one of: Pending, In Progress, Completed"),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),
];

// ── Routes ────────────────────────────────────────────────────────────────────

// GET    /api/tasks          — Get all tasks (search, filter, sort via query params)
router.get("/", getTasks);

// GET    /api/tasks/:id      — Get single task by ID
router.get("/:id", idParamValidation, validate, getTaskById);

// POST   /api/tasks          — Create a new task
router.post("/", createTaskValidation, validate, createTask);

// PUT    /api/tasks/:id      — Update a task
router.put("/:id", idParamValidation, updateTaskValidation, validate, updateTask);

// DELETE /api/tasks/:id      — Delete a task
router.delete("/:id", idParamValidation, validate, deleteTask);

module.exports = router;
