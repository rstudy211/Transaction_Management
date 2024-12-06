const express = require("express");
const dotenv = require("dotenv");
const database = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
// const userRoutes = require('./routes/userRoutes');
const path = require("path");
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection
database();

// set the view engine to ejs
app.set('view engine', 'ejs');


// API routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

// Public  directory setup
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// Export the app instance for server.js
module.exports = app;
