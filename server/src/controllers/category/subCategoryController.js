import { SubCategoryModel } from "../../models/category/SubCategoryModel.js";
import { CategoryModel } from "../../models/category/CategoryModel.js";
import { SubCategoryTypeModel } from "../../models/category/subCategoryTypeModel.js";

/* Add SubCategory */
export const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = await SubCategoryModel.create({
      name,
      category: categoryId,
    });

    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get All SubCategories */
export const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategoryModel.find().populate("category");
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get SubCategories by Category by ID */
export const getSubCategoriesByCategory = async (req, res) => {
  try {
    const subCategories = await SubCategoryModel.find({
      category: req.params.categoryId,
    }).populate("category");

    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Delete SubCategory - RESTRICT */
export const deleteSubCategory = async (req, res) => {
  try {
    const subCategoryId = req.params.id;

    // Check if variants exist this is not working
    const variantExists = await SubCategoryTypeModel.find({
      subCategory: subCategoryId,
    });

    if (variantExists.length > 0) {
      return res.status(400).json({
        message: "Cannot delete subcategory. Variants exist.",
      });
    }

    // Delete only if safe
    const deletedSubCategory =
      await SubCategoryModel.findByIdAndDelete(subCategoryId);

    if (!deletedSubCategory) {
      return res.status(404).json({
        message: "SubCategory not found",
      });
    }

    res.json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
