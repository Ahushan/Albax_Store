import { nanoid } from "nanoid";
import { Variant } from "../../models/product/VariantModel.js";
import Product from "../../models/product/ProductModel.js";

// ADD VARIANT TO PRODUCT
export const addVariant = async (req, res) => {
  try {
    const { productId } = req.params;
    const variantData = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Auto-generate SKU if not provided
    if (!variantData.sku) {
      variantData.sku = nanoid(10).toUpperCase();
    }

    // Check duplicate SKU
    const existingSku = await Variant.findOne({ sku: variantData.sku });
    if (existingSku) {
      return res.status(400).json({ message: "Duplicate SKU found" });
    }

    // Check duplicate attributes
    const existing = await Variant.findOne({
      product: productId,
      attributes: variantData.attributes,
    });
    if (existing) {
      return res.status(400).json({ message: "Duplicate variant attributes" });
    }

    const variant = await Variant.create({
      ...variantData,
      product: productId,
    });

    res.status(201).json({ message: "Variant added", variant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL VARIANTS FOR A PRODUCT
export const getVariantsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const variants = await Variant.find({ product: productId });

    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE VARIANT
export const updateVariant = async (req, res) => {
  try {
    const { variantId } = req.params;

    const variant = await Variant.findByIdAndUpdate(variantId, req.body, {
      new: true,
    });

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.json({ message: "Variant updated", variant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE VARIANT
export const deleteVariant = async (req, res) => {
  try {
    const { variantId } = req.params;

    const variant = await Variant.findByIdAndDelete(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.json({ message: "Variant deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
