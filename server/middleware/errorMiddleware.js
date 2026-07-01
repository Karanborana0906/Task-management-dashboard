// middleware/errorMiddleware.js
// Centralized global error handler middleware

const mongoose = require("mongoose");

/**
 * Middleware: errorHandler
 * Catches all errors passed via next(err) and returns consistent JSON error responses.
 * Must be registered LAST among middleware in server.js.
 *
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ── Mongoose: Invalid ObjectId ───────────────────────────────────────────
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = `Invalid ID format: '${err.value}'`;
  }

  // ── Mongoose: Duplicate Key (unique constraint violation) ────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    message = `An account with this ${field} already exists.`;
  }

  // ── Mongoose: Validation Errors ──────────────────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // ── JWT: Invalid Token ───────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  // ── JWT: Expired Token ───────────────────────────────────────────────────
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again.";
  }

  // ── Development: include stack trace ────────────────────────────────────
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

/**
 * Middleware: notFound
 * Handles requests to undefined routes.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
