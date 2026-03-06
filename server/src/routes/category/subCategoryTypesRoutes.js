import express from "express";
import {
  createSubCategoryType,
  getTypesBySubCategory,
  deleteSubCategoryType,
} from "../../controllers/category/subCategoryTypeController.js";

const router = express.Router();

router.post("/", createSubCategoryType);
router.get("/:subCategoryId", getTypesBySubCategory);
router.delete("/:id", deleteSubCategoryType);

export default router;
