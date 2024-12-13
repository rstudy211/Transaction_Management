const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const { sequelize } = require("./config/db.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// Import Swagger Setup
const swaggerSetup = require("./config/swagger.js");

// Load environment variables
require("./config/env.js");
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors({
  origin: ["127.0.0.1"],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection
connectDB();

// Setup Swagger UI
swaggerSetup(app);  // Add Swagger UI to the app

// Set the view engine to ejs
app.set("view engine", "ejs");

// Import versioned routes
const v1Routes = require("./routes/v1");

// API versioning middleware
app.use("/api/v1", v1Routes);


// Public directory setup
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

// Sync Sequelize models with database
sequelize.sync({ force: false }) // Set force: false to avoid dropping existing tables
  .then(() => {
    console.log("Database synced successfully!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// Export the app instance for server.js
module.exports = app;
