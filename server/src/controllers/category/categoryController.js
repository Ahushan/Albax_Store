import { CategoryModel } from "../../models/category/CategoryModel.js";
import { SubCategoryModel } from "../../models/category/SubCategoryModel.js";

/* Create Category */
export const createCategory = async (req, res) => {
  try {
    const category = await CategoryModel.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get All Categories */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Delete Category - RESTRICT */
export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if subcategories exist
    const subCategoryExists = await SubCategoryModel.exists({
      category: categoryId,
    });

    if (subCategoryExists) {
      return res.status(400).json({
        message: "Cannot delete category. Subcategories exist.",
      });
    }

    // Delete only if no subcategories
    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
