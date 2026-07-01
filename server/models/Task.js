// models/Task.js
// Mongoose Task schema and model

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },

    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "Priority must be one of: Low, Medium, High",
      },
      default: "Medium",
    },

    status: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Completed"],
        message: "Status must be one of: Pending, In Progress, Completed",
      },
      default: "Pending",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    // ── Relationship: Each task belongs to exactly one user ──
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must belong to a user"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Index for faster querying by user + status/priority ─────────────────────
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, createdAt: -1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
