import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, ChevronDown, Package, Layers } from "lucide-react";
import { ImageUploader } from "@/admin/components/commons/ImageUploader";
import { KeyValueInput } from "@/admin/components/commons/KeyValueInput";
import api from "@/api/API";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

type VariantType = {
  attributes: Record<string, string>;
  price: number;
  comparePrice?: number;
  stock: number;
  sku: string;
  images: string[];
};

type FormValues = {
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: string; // UI-only — not sent to backend
  subCategory: string; // UI-only — not sent to backend
  subCategoryType: string;
  gallery: string[];
  variants: VariantType[];
};

export default function CreateProduct() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      brand: "",
      category: "",
      subCategory: "",
      subCategoryType: "",
      gallery: [],
      variants: [
        {
          attributes: {},
          price: 0,
          stock: 0,
          sku: "",
          images: [],
        },
      ],
    },
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [subCategoryTypes, setSubCategoryTypes] = useState<any[]>([]);

  const selectedCategory = watch("category");
  const selectedSubCategory = watch("subCategory");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  /* ── Fetch Categories ── */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load categories",
        );
      }
    };
    fetchCategories();
  }, []);

  /* ── Fetch Sub Categories (on category change) ── */
  useEffect(() => {
    if (!selectedCategory) {
      setSubCategories([]);
      setSubCategoryTypes([]);
      return;
    }

    const fetchSubCategories = async () => {
      try {
        const res = await api.get(`/subcategories/${selectedCategory}`);
        setSubCategories(res.data);
        setSubCategoryTypes([]);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load subcategories",
        );
      }
    };
    fetchSubCategories();
  }, [selectedCategory]);

  /* ── Fetch Sub Category Types (on subcategory change) ── */
  useEffect(() => {
    if (!selectedSubCategory) {
      setSubCategoryTypes([]);
      return;
    }

    const fetchTypes = async () => {
      try {
        const res = await api.get(`/sub-category-types/${selectedSubCategory}`);
        setSubCategoryTypes(res.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load types");
      }
    };
    fetchTypes();
  }, [selectedSubCategory]);

  /* ── Submit ── */
  const onSubmit = async (data: FormValues) => {
    try {
      // Strip UI-only fields
      const { category, subCategory, ...payload } = data;
      await api.post("/demo/product", payload);
      toast.success("Product created successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Product</h1>
          <p className="text-sm text-gray-400">Demo product form</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* ── Classification ── */}
        <section className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-800">
              Product Classification
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Category
              </label>
              <div className="relative">
                <select
                  {...register("category", { required: true })}
                  className="input-modern appearance-none pr-10"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Sub Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Sub Category
              </label>
              <div className="relative">
                <select
                  {...register("subCategory", { required: true })}
                  className="input-modern appearance-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedCategory}
                >
                  <option value="">Select Sub Category</option>
                  {subCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Sub Category Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Sub Category Type
              </label>
              <div className="relative">
                <select
                  {...register("subCategoryType", { required: true })}
                  className="input-modern appearance-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedSubCategory}
                >
                  <option value="">Select Type</option>
                  {subCategoryTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Basic Info ── */}
        <section className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Product Name
              </label>
              <input
                {...register("name", { required: true })}
                placeholder="Product Name"
                className="input-modern"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Slug</label>
              <input
                {...register("slug", { required: true })}
                placeholder="product-slug"
                className="input-modern"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Brand</label>
              <input
                {...register("brand")}
                placeholder="Brand name"
                className="input-modern"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              {...register("description")}
              placeholder="Describe the product..."
              className="input-modern h-24 resize-none"
            />
          </div>
        </section>

        {/* ── Product Gallery ── */}
        <section className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Product Gallery</h2>

          <Controller
            control={control}
            name="gallery"
            render={({ field }) => (
              <ImageUploader
                uniqueId="product-gallery"
                onUploadComplete={(imgs) =>
                  field.onChange(imgs.map((img) => img.url))
                }
              />
            )}
          />
        </section>

        {/* ── Variants ── */}
        <section className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-white font-bold">Variants</h2>

            <button
              type="button"
              onClick={() =>
                append({
                  attributes: {},
                  price: 0,
                  stock: 0,
                  sku: "",
                  images: [],
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700 rounded-xl text-sm font-medium transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Variant
            </button>
          </div>

          {fields.map((fieldItem, index) => (
            <div
              key={fieldItem.id}
              className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-800">
                    Variant {index + 1}
                  </h3>
                  {index === 0 && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>

              {/* Attributes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Attributes
                </label>
                <Controller
                  control={control}
                  name={`variants.${index}.attributes`}
                  render={({ field }) => (
                    <KeyValueInput
                      value={field.value || {}}
                      onChange={field.onChange}
                      keyPlaceholder="e.g. Color"
                      valuePlaceholder="e.g. Black"
                    />
                  )}
                />
              </div>

              {/* Price, Compare Price, Stock, SKU */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Price
                  </label>
                  <input
                    type="number"
                    {...register(`variants.${index}.price`, {
                      required: true,
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                    className="input-modern"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Compare Price
                  </label>
                  <input
                    type="number"
                    {...register(`variants.${index}.comparePrice`, {
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                    className="input-modern"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Stock
                  </label>
                  <input
                    type="number"
                    {...register(`variants.${index}.stock`, {
                      required: true,
                      valueAsNumber: true,
                    })}
                    placeholder="0"
                    className="input-modern"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    SKU
                  </label>
                  <input
                    {...register(`variants.${index}.sku`, { required: true })}
                    placeholder="SKU-001"
                    className="input-modern"
                  />
                </div>
              </div>

              {/* Variant Images */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Variant Images
                </label>
                <Controller
                  control={control}
                  name={`variants.${index}.images`}
                  render={({ field }) => (
                    <ImageUploader
                      uniqueId={`variant-${index}`}
                      onUploadComplete={(imgs) =>
                        field.onChange(imgs.map((img) => img.url))
                      }
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </section>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
