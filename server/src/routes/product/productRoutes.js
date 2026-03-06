import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getVariantByAttributes,
} from "../../controllers/product/productController.js";
import {
  addVariant,
  getVariantsByProduct,
  updateVariant,
  deleteVariant,
} from "../../controllers/product/VariantController.js";

const router = express.Router();

// Product routes
router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// Variant routes
router.post("/variant/:productId", getVariantByAttributes);
router.post("/:productId/variants", addVariant);
router.get("/:productId/variants", getVariantsByProduct);
router.put("/variants/:variantId", updateVariant);
router.delete("/variants/:variantId", deleteVariant);

export default router;
