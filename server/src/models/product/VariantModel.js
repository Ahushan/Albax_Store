import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DemoProduct",
      required: true,
      index: true,
    },

    attributes: {
      type: Map,
      of: String,
    },

    price: { type: Number, required: true },

    comparePrice: Number,

    stock: { type: Number, default: 0 },

    sku: { type: String, unique: true, required: true },

    images: [String],

    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

variantSchema.index({ product: 1 });
variantSchema.index({ "attributes.Color": 1 });
variantSchema.index({ "attributes.Size": 1 });

export const Variant =
  mongoose.models.Variant || mongoose.model("Variant", variantSchema);
