import mongoose from "mongoose";

const { Schema } = mongoose;

const subCategoryTypeSchema = new Schema(
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

    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
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
subCategoryTypeSchema.pre("validate", function () {
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
});

export const SubCategoryTypeModel =
  mongoose.models.SubCategoryType ||
  mongoose.model("SubCategoryType", subCategoryTypeSchema);
