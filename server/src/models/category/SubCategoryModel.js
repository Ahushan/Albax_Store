import mongoose from "mongoose";

const { Schema } = mongoose;

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

/* Auto Slug */
subCategorySchema.pre("validate", function () {
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
});

export const SubCategoryModel =
  mongoose.models.SubCategory ||
  mongoose.model("SubCategory", subCategorySchema);
