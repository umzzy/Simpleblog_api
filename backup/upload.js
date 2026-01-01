const multer = require("multer");
const path = require("path");
const generateCode = require("../utils/generatecode");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    // originalname can be replaced with any unique naming convention
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const filename = originalName.replace(extension, "");
    const compressedFilename = filename.split(" ").join("_");
    const lowercaseFilename = compressedFilename.toLowerCase();
    const code = generateCode(12);
    const finalFile = `${lowercaseFilename}_${code}${extension}`;
    callback(null, finalFile);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const mimeTypes = file.mimetype;
    if (
      mimeTypes === "image/png" ||
      mimeTypes === "image/jpg" ||
      mimeTypes === "image/jpeg"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
    }
  },
});

module.exports = upload;
