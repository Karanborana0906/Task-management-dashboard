// server.js
// Entry point — configures Express, mounts routes, and starts the server

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// ── Load environment variables ────────────────────────────────────────────────
dotenv.config();

// ── Database connection ───────────────────────────────────────────────────────
const connectDB = require("./config/db");

// ── Route modules ─────────────────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// ── Error handling middleware ─────────────────────────────────────────────────
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Initialize Express app ────────────────────────────────────────────────────
const app = express();

// ── CORS Configuration ────────────────────────────────────────────────────────
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// ── Body Parsing Middleware ───────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));         // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies
app.use(cookieParser());                          // Parse Cookie headers

// ── Health Check Endpoint ─────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Management Dashboard API is running 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ── 404 Handler — must be after all routes ────────────────────────────────────
app.use(notFound);

// ── Global Error Handler — must be the last middleware ────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}\n`);
});

// ── Handle Unhandled Promise Rejections ───────────────────────────────────────
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// ── Handle Uncaught Exceptions ────────────────────────────────────────────────
process.on("uncaughtException", (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = app;
