const { Category, User } = require("../models");

const addCategory = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { _id } = req.user;

    const isCategoryExist = await Category.findOne({ title });
    if (isCategoryExist) {
      res.code = 400;
      throw new Error("Category already exists");
    }

    const user = await User.findById(_id);
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    const newCategory = new Category({
      title,
      description,
      UpdatedBy: _id,
    });
    await newCategory.save();

    res.status(201).json({
      code: 201,
      status: true,
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (err) {
    next(err);
  }
};
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const { title, description } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      res.code = 404;
      throw new Error("Category not found");
    }
    const isCategoryExist = await Category.findOne({ title });
    if (
      isCategoryExist &&
      isCategoryExist.title === title &&
      String(isCategoryExist._id) !== String(category._id)
    ) {
      res.code = 400;
      throw new Error("Category title already in use by another category");
    }
    category.title = title ? title : category.title;
    category.description = description ? description : category.description;
    category.UpdatedBy = _id;
    await category.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Category updated successfully",
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      res.code = 404;
      throw new Error("Category not found");
    }
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      code: 200,
      status: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
const getAllCategories = async (req, res, next) => {
  try {
    const { q, size, page } = req.query;
    let query = {};

    const sizeNumber = parseInt(size) || 10;
    const pageNumber = parseInt(page) || 1;

    if (q) {
      const search = RegExp(q, "i");
      query = { $or: [{ title: search }, { description: search }] };
    }

    const total = await Category.countDocuments(query);
    const pages = Math.ceil(total / sizeNumber);

    const categories = await Category.find(query)
      .sort({ updatedBy: -1 })
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber);
    res.status(200).json({
      code: 200,
      status: true,
      message: "Get categories successfully",
      data: { categories, total, pages },
    });
  } catch (err) {
    next(err);
  }
};
const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      res.code = 404;
      throw new Error("Category not found");
    }
    res.status(200).json({
      code: 200,
      status: true,
      message: "Category retrieved successfully",
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
};
