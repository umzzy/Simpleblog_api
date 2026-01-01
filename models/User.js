// import mongoose to create a user model
const mongoose = require("mongoose");

// define the user schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6 },
    // role: 1 - Super admin, 2 - Normal admin, 3 - Normal user
    role: { type: Number, default: 3 },
    verificationCode: String,
    forgetPasswordCode: String,
    isVerified: { type: Boolean, default: false },
    profilePic: { type: mongoose.Types.ObjectId, ref: "file" },
  },
  { timestamps: true }
);

// create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
