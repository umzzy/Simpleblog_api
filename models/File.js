const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    key: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const File = mongoose.model("file", fileSchema);

module.exports = File;
