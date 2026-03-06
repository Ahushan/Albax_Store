import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    slug: { type: String, unique: true },

    description: String,

    brand: String,

    subCategoryType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategoryType",
      required: true,
    },

    gallery: [String],

    baseVariant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },

    generalSpecifications: [
      {
        icon: { type: String, required: true },
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// auto slug
productSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
