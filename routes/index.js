// import the auth routes
const authRoutes = require("./auth");
const categoryRoutes = require("./category");
const fileRoutes = require("./file");
const postRoutes = require("./post");

// export the routes
module.exports = {
  authRoutes,
  categoryRoutes,
  fileRoutes,
  postRoutes,
};
