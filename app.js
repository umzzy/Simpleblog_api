// Importing necessary modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./init/mongodb");
const morgan = require("morgan");
const {
  authRoutes,
  categoryRoutes,
  fileRoutes,
  postRoutes,
} = require("./routes");
const { errorHandler } = require("./Middlewares");
const notfound = require("./controller/notfound");

// Connect to the database
connectDB();

// Initializing the Express application
const app = express();

// Middleware setup
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(morgan("dev"));

// Setting up routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/file", fileRoutes);
app.use("/api/v1/posts", postRoutes);
app.use(errorHandler);
app.use(notfound);

// Exporting the app for use in other files
module.exports = app;
