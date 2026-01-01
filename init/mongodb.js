// import mongoose library and configuration keys
const mongoose = require("mongoose");
const { connectionUrl } = require("../config/keys");

// connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(connectionUrl);
    console.log("Connection to Database Successful");
  } catch (error) {
    console.log(error.message);
  }
};

// export the connectDB function
module.exports = connectDB;
