const Subcategory = require("../models/subcategoyModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createSubcategory = async (req, res) => {
  const { title, categoryId } = req.body;

  const newSubcategory = await Subcategory.create({ title, categoryId });
  res.status(201).json(newSubcategory);
};

const updateSubcategory = async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL
  const { title, categoryId } = req.body; // Lấy dữ liệu cần cập nhật từ request body
  try {
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      { title, categoryId }, // Dữ liệu cần cập nhật
      { new: true, runValidators: true } // Tùy chọn: trả về bản ghi sau khi cập nhật
    );

    if (!updatedSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json(updatedSubcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubcategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSubcategory = await Subcategory.findByIdAndDelete(id);

    if (!deletedSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubcategory = async (req, res) => {
  const { id } = req.params;

  try {
    const subcategory = await Subcategory.findById(id).populate("categoryId", "title");

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSubcategories = async (req, res) => {
  try {

    const { limit } = req.query
    let subcategories = []
    if (limit !== undefined) {
      subcategories = await Subcategory.find().limit(parseInt(limit)).populate("categoryId", "title")

    } else {
      subcategories = await Subcategory.find().populate("categoryId", "title")
    }

    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getSubcategoryFlowIdCategories = async (req, res) => {
  const { id } = req.params;

  try {
    const subcategory = await Subcategory.find({ categoryId: id }).populate("categoryId", "title");

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getSubcategory,
  getAllSubcategories,
  getSubcategoryFlowIdCategories
};