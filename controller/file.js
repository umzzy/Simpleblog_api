const path = require("path");
const validateExtension = require("../validators/file");
const {
  uploadFileToS3,
  signedUrl,
  deleteFileFromS3,
} = require("../utils/awsS3");
const { File } = require("../models");

const uploadFile = async (req, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      res.code = 400;
      throw new Error("File is not selected");
    }
    const ext = path.extname(file.originalname);
    const isValidExt = validateExtension(ext);

    if (!isValidExt) {
      res.code = 400;
      throw new Error("Only .jpeg, .jpg, .png format are accepted");
    }

    const key = await uploadFileToS3({ file, ext });
    if (key) {
      const newFile = new File({
        key,
        size: file.size,
        mimetype: file.mimetype,
        createdBy: req.user._id,
      });
      await newFile.save();
    }

    res.status(201).json({
      code: 201,
      status: true,
      message: "File uploaded successfully",
      data: { key },
    });
  } catch (err) {
    next(err);
  }
};
const getSignedUrl = async (req, res, next) => {
  try {
    const { key } = req.query;
    const url = await signedUrl(key);

    res.status(200).json({
      code: 200,
      status: true,
      message: "Get Signed Url successfully",
      data: { url },
    });
  } catch (err) {
    next(err);
  }
};
const deleteFile = async (req, res, next) => {
  try {
    const { key } = req.query;
    await deleteFileFromS3(key);
    await File.findOneAndDelete({ key });

    res
      .status(200)
      .json({ code: 200, status: true, message: "File Deleted Successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadFile, getSignedUrl, deleteFile };
