// Load environment variables from a .env file to keep sensitive data like API keys and database URLs secure and separate from the code
require("dotenv").config();

// Import Express framework to build the web server and handle HTTP requests/responses easily
const express = require("express");

// Import body-parser (though Express now has built-in parsing, this might be for legacy reasons or specific needs)
const bodyParser = require("body-parser");

// Import the database connection function to connect to MongoDB for storing and retrieving data
const connectDB = require("./init/mongodb");

// Import Morgan for logging HTTP requests in the console, helping with debugging and monitoring server activity
const morgan = require("morgan");

// Import route handlers for different parts of the API: authentication, categories, files, and posts
const {
    authRoutes,
    categoryRoutes,
    fileRoutes,
    postRoutes,
} = require("./routes");

// Import error handling middleware to catch and respond to errors gracefully
const { errorHandler } = require("./Middlewares");

// Import the not found controller to handle requests to non-existent routes
const notfound = require("./controller/notfound");

// Connect to the MongoDB database so the app can interact with it for data operations
connectDB();

// Create an instance of the Express application to set up the server
const app = express();

// Middleware to parse incoming JSON data in request bodies, with a limit of 500MB to handle large payloads like file uploads
app.use(express.json({ limit: "500mb" }));

// Middleware to parse URL-encoded data (from forms), allowing nested objects and setting a 500MB limit
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

// Use Morgan in 'dev' mode to log requests with details like method, URL, status, and response time for development purposes
app.use(morgan("dev"));

// Mount authentication routes under /api/v1/auth to handle login, signup, and user-related operations
app.use("/api/v1/auth", authRoutes);

// Mount category routes under /api/v1/category to manage blog categories like creating or listing them
app.use("/api/v1/category", categoryRoutes);

// Mount file routes under /api/v1/file to handle file uploads and related operations
app.use("/api/v1/file", fileRoutes);

// Mount post routes under /api/v1/posts to manage blog posts, such as creating, reading, updating, or deleting them
app.use("/api/v1/posts", postRoutes);

// Use error handling middleware to catch any errors that occur during request processing and send appropriate responses
app.use(errorHandler);

// Use the not found handler as a catch-all for any unmatched routes, returning a 404 response
app.use(notfound);

// Export the app instance so it can be imported and used in other files, like index.js to start the server
module.exports = app;
