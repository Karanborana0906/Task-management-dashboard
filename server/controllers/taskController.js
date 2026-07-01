// controllers/taskController.js
// Handles all CRUD operations for tasks with search, filter, and sort support

const mongoose = require("mongoose");
const Task = require("../models/Task");

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all tasks for the logged-in user
//          Supports: search (title), filter (status, priority), sort (dueDate, createdAt)
// @route   GET /api/tasks
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy, order } = req.query;

    // ── Build filter query — always scoped to the authenticated user ──────
    const query = { user: req.user._id };

    // ── Search: title contains keyword (case-insensitive regex) ──────────
    if (search && search.trim() !== "") {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    // ── Filter by status ──────────────────────────────────────────────────
    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (status && validStatuses.includes(status)) {
      query.status = status;
    }

    // ── Filter by priority ────────────────────────────────────────────────
    const validPriorities = ["Low", "Medium", "High"];
    if (priority && validPriorities.includes(priority)) {
      query.priority = priority;
    }

    // ── Sort configuration ────────────────────────────────────────────────
    const sortOrder = order === "asc" ? 1 : -1; // default: descending
    let sortConfig = { createdAt: -1 }; // default sort

    if (sortBy === "dueDate") {
      sortConfig = { dueDate: sortOrder };
    } else if (sortBy === "createdAt") {
      sortConfig = { createdAt: sortOrder };
    }

    // ── Execute query ─────────────────────────────────────────────────────
    const tasks = await Task.find(query).sort(sortConfig);

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ── Validate ObjectId format ──────────────────────────────────────────
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${id}'`,
      });
    }

    // ── Find task scoped to the authenticated user ────────────────────────
    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you do not have permission to view it.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    // ── Create task — automatically associate with logged-in user ─────────
    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ── Validate ObjectId format ──────────────────────────────────────────
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${id}'`,
      });
    }

    // ── Find task scoped to the authenticated user ────────────────────────
    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you do not have permission to update it.",
      });
    }

    // ── Apply updates — only update fields that are provided ──────────────
    const { title, description, priority, status, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ── Validate ObjectId format ──────────────────────────────────────────
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${id}'`,
      });
    }

    // ── Find and delete task scoped to the authenticated user ─────────────
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you do not have permission to delete it.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: { _id: id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
