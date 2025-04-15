const fs = require("fs");
const asyncHandler = require("express-async-handler");
const path = require('path');

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

const uploadImages = asyncHandler(async (req, res) => {
  try {
    // Ensure that a single file is uploaded
    const file = req.files[0];  // If only one file is expected
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const destinationPath = path.join(__dirname, 'public', 'images', 'products', filename);

    // Move the uploaded file to the target folder (public/images/products)
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    res.json({
      message: 'File uploaded successfully', data: {
        filename: file.filename,
      }
    });
  } catch (error) {
    throw new Error(error);
  }
});
const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};
