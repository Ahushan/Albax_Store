import { SubCategoryTypeModel } from "../../models/category/subCategoryTypeModel.js";
import { SubCategoryModel } from "../../models/category/SubCategoryModel.js";
import Product from "../../models/product/ProductModel.js";

/* Create Sub Category Type */
export const createSubCategoryType = async (req, res) => {
  try {
    const { name, subCategoryId } = req.body;

    const subCategory = await SubCategoryModel.findById(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    const subCategoryType = await SubCategoryTypeModel.create({
      name,
      subCategory: subCategoryId,
    });

    res.status(201).json(subCategoryType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get Sub Category Types by SubCategory */
export const getTypesBySubCategory = async (req, res) => {
  try {
    const subCategoryTypes = await SubCategoryTypeModel.find({
      subCategory: req.params.subCategoryId,
    }).populate("subCategory");

    res.json(subCategoryTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Delete Sub Category Type - RESTRICT */
export const deleteSubCategoryType = async (req, res) => {
  try {
    const subCategoryTypeId = req.params.id;

    // 1️⃣ Check if products use this variant
    const productExists = await Product.exists({
      subCategoryType: subCategoryTypeId,
    });

    if (productExists) {
      return res.status(400).json({
        message:
          "Cannot delete Sub Category Type. Products exist for this Sub Category Type.",
      });
    }

    // 2️⃣ Safe delete
    const deletedSubCategoryType =
      await SubCategoryTypeModel.findByIdAndDelete(subCategoryTypeId);

    if (!deletedSubCategoryType) {
      return res.status(404).json({
        message: "Sub Category Type not found",
      });
    }

    res.json({ message: "Sub Category Type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
