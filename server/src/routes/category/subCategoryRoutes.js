import express from "express";
import {
  createSubCategory,
  getSubCategoriesByCategory,
  deleteSubCategory,
  getAllSubCategories,
} from "../../controllers/category/subCategoryController.js";

const router = express.Router();

router.post("/", createSubCategory);
router.get("/:categoryId", getSubCategoriesByCategory);
router.delete("/:id", deleteSubCategory);
router.get("/", getAllSubCategories);

export default router;
