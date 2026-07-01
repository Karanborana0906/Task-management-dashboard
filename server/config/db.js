// config/db.js
// MongoDB connection configuration using Mongoose

const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the URI from environment variables.
 * Exits the process on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`
    );
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
