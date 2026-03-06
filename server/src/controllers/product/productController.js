import slugify from "slugify";
import { nanoid } from "nanoid";
import Product from "../../models/product/ProductModel.js";
import { Variant } from "../../models/product/VariantModel.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { title, description, brand, subCategoryType, gallery, variants } =
      req.body;

    if (!variants || variants.length === 0) {
      return res.status(400).json({ message: "At least one variant required" });
    }

    // 1️⃣ Create product
    const product = await Product.create({
      name: title,
      description,
      brand,
      subCategoryType,
      gallery,
    });

    // 2️⃣ Auto-generate SKU if not provided
    variants.forEach((v) => {
      if (!v.sku) {
        v.sku = nanoid(10).toUpperCase();
      }
    });

    // 3️⃣ Validate duplicate SKUs
    const skus = variants.map((v) => v.sku);
    const duplicateSku = await Variant.findOne({ sku: { $in: skus } });
    if (duplicateSku) {
      await Product.findByIdAndDelete(product._id);
      return res.status(400).json({ message: "Duplicate SKU found" });
    }

    // 4️⃣ Prevent duplicate attribute combinations
    const attributeSet = new Set();
    for (let v of variants) {
      const key = JSON.stringify(v.attributes);
      if (attributeSet.has(key)) {
        await Product.findByIdAndDelete(product._id);
        return res
          .status(400)
          .json({ message: "Duplicate variant attributes" });
      }
      attributeSet.add(key);
    }

    // 5️⃣ Create variants
    const createdVariants = await Variant.insertMany(
      variants.map((v) => ({
        ...v,
        product: product._id,
      })),
    );

    // 5️⃣ Set base variant
    product.baseVariant = createdVariants[0]._id;
    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
      variants: createdVariants,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("subCategoryType")
      .populate("baseVariant")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("subCategoryType")
      .populate("baseVariant");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variants = await Variant.find({ product: product._id });

    res.json({ product, variants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PRODUCT (with variants)
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    await Variant.deleteMany({ product: productId });
    await Product.findByIdAndDelete(productId);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET VARIANT BY ATTRIBUTES
export const getVariantByAttributes = async (req, res) => {
  try {
    const { productId } = req.params;
    const { attributes } = req.body;

    const variant = await Variant.findOne({
      product: productId,
      attributes,
    });

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
