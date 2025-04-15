const express = require("express");
const {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getSubcategory,
  getAllSubcategories,
  getSubcategoryFlowIdCategories
} = require("../controller/subcategoriesCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createSubcategory);
router.put("/:id", authMiddleware, isAdmin, updateSubcategory);
router.delete("/:id", authMiddleware, isAdmin, deleteSubcategory);
router.delete("/:id", authMiddleware, isAdmin, deleteSubcategory);
router.get("/category/:id", getSubcategoryFlowIdCategories);
router.get("/", getAllSubcategories);

module.exports = router;
