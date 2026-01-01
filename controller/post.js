const { File, Category, Post } = require("../models");

const addPost = async (req, res, next) => {
  try {
    const { title, description, file, category } = req.body;
    const { _id } = req.user;

    if (file) {
      const isFileExist = await File.findById(file);
      if (!isFileExist) {
        res.code = 404;
        throw new Error("File not found!!");
      }
    }

    const isCategoryExist = await Category.findById(category);
    if (!isCategoryExist) {
      res.code = 404;
      throw new Error("Category not found!!!");
    }
    const newPost = new Post({
      title,
      description,
      category,
      file,
      updatedBy: _id,
    });
    await newPost.save();
    res
      .status(201)
      .json({ code: 201, status: true, message: "Post added successfully" });
  } catch (err) {
    next(err);
  }
};
const updatePost = async (req, res, next) => {
  try {
    const { title, description, file, category } = req.body;
    const { id } = req.params;
    const { _id } = req.user;
    if (file) {
      const isFileExist = await File.findById(file);
      if (!file) {
        res.code = 404;
        throw new Error("File not found");
      }
    }
    if (category) {
      const isCategoryExist = await Category.findById(category);
      if (!category) {
        res.code = 404;
        throw new Error("Category not found");
      }
    }
    const post = await Post.findById(id);
    if (!post) {
      res.code = 404;
      throw new Error("Post not found");
    }
    post.title = title ? title : post.title;
    post.description = description ? description : post.description;
    post.file = file ? file : post.file;
    post.category = category ? category : post.category;
    post.updatedBy = _id;
    await post.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Post updated successfully",
      data: { post },
    });
  } catch (err) {
    next(err);
  }
};
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      res.code = 404;
      throw new Error("Post not found");
    }

    await Post.findByIdAndDelete(id);
    res
      .status(200)
      .json({ code: 200, status: true, message: "Post Deleted Successfully" });
  } catch (err) {
    next(err);
  }
};
const getPosts = async (req, res, next) => {
  try {
    const { page, size, q, category } = req.query;

    const pageNumber = parseInt(page) || 1;
    const sizeNumber = parseInt(size) || 10;
    let query = {};

    if (q) {
      const search = new RegExp(q, "i");

      query = {
        $or: [{ title: search }],
      };
    }
    if (category) {
      query = { ...query, category };
    }
    console.log(query);
    const total = await Post.countDocuments(query);
    const pages = Math.ceil(total / sizeNumber);

    const posts = await Post.find(query)
      .populate("file")
      .populate("updatedBy", "_id name email role")
      .populate("category")
      .sort({ updatedBy: -1 })
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber);

    res.status(200).json({
      code: 200,
      status: true,
      message: "Get post list successfully",
      data: { posts, total, pages },
    });
  } catch (err) {
    next(err);
  }
};
const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("file")
      .populate("updatedBy", "_id name email role")
      .populate("category");
    if (!post) {
      res.code = 404;
      throw new Error("Post not found");
    }
    res.status(200).json({
      code: 200,
      status: true,
      message: "Get post successfully",
      data: { post },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { addPost, updatePost, deletePost, getPosts, getPost };
