const { check, param } = require("express-validator");
const mongoose = require("mongoose");

const addPostValidator = [
  check("title").notEmpty().withMessage("Title required"),
  check("file").custom(async (file) => {
    if (file && !mongoose.Types.ObjectId.isValid(file)) {
      throw new Error("Invalid file");
    }
  }),
  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .custom(async (category) => {
      if (category && !mongoose.Types.ObjectId.isValid(category)) {
        throw new Error("Invalid Category");
      }
    }),
];
const updatePostValidator = [
  check("file").custom(async (file) => {
    if (file && !mongoose.Types.ObjectId.isValid(file)) {
      throw new Error("Invalid file");
    }
  }),
  check("category").custom(async (category) => {
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      throw new Error("Invalid Category");
    }
  }),
];
const idValidator = [
  param("id").custom(async (id) => {
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid post id");
    }
  }),
];

module.exports = { addPostValidator, updatePostValidator, idValidator };
