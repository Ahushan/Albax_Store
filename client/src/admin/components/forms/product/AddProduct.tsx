"use client";

import {
  ProductFormValues,
  useProductForm,
} from "@/admin/hooks/useProductForm";
import { ImageUploader } from "@/admin/components/commons/ImageUploader";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/api/API";
import { KeyValueInput } from "../../commons/KeyValueInput";
import { InfoNote } from "../../commons/InfoNote";
import {
  Plus,
  Trash2,
  Package,
  Tag,
  Layers,
  Image,
  Settings,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AddProductForm() {
  const {
    register,
    handleSubmit,
    isSubmitting,
    variants,
    addVariant,
    removeVariant,
    generalSpecifications,
    addGeneralSpecification,
    removeGeneralSpecification,
    addUniqueSpecToVariant,
    removeUniqueSpecFromVariant,
    control,
    watch,
    errors,
  } = useProductForm();

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [subCategoryTypes, setSubCategoryTypes] = useState<any[]>([]);
  const [flagInput, setFlagInput] = useState("");

  const selectedCategory = watch("category");
  const selectedSubCategory = watch("subCategory");

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  /* ================= FETCH SUB CATEGORIES ================= */
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
        setSubCategoryTypes([]); // reset types
      } catch (err) {
        console.error("Failed to fetch subcategories", err);
      }
    };

    fetchSubCategories();
  }, [selectedCategory]);

  /* ================= FETCH TYPES ================= */
  useEffect(() => {
    if (!selectedSubCategory) {
      setSubCategoryTypes([]);
      return;
    }

    const fetchTypes = async () => {
      try {
        const res = await api.get(`/sub-category-types/${selectedSubCategory}`);
        setSubCategoryTypes(res.data);
      } catch (err) {
        console.error("Failed to fetch sub-category types", err);
      }
    };

    fetchTypes();
  }, [selectedSubCategory]);

  const onSubmit = async (data: ProductFormValues) => {
    const { category, subCategory, ...rest } = data;
    const payload = { ...rest };
    try {
      const res = await api.post("/product", payload);
      console.log(payload);
      toast.success("Product created successfully");
    } catch (err: any) {
      toast.error("Failed to create product", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen p-4 md:p-8 lg:p-10 space-y-8 max-w-6xl mx-auto"
    >
      {/* ── Page Header ── */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Product</h1>
          <p className="text-sm text-gray-400">
            Fill in the details to add a new product
          </p>
        </div>
      </div>

      {/* ================= CATEGORY SECTION ================= */}
      <section className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-800">
            Product Classification
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* CATEGORY */}
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

          {/* SUB CATEGORY */}
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

          {/* TYPE */}
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

      {/* ================= BASIC INFO ================= */}
      <section className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Title</label>
            <input
              {...register("title")}
              className="input-modern"
              placeholder="Product title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Brand</label>
            <input
              {...register("brand")}
              className="input-modern"
              placeholder="Brand name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            {...register("description")}
            className="input-modern h-28 resize-none"
            placeholder="Describe the product..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-600">
              Base Image
            </label>
          </div>
          <Controller
            control={control}
            name="baseImage"
            render={({ field }) => (
              <ImageUploader
                uniqueId="base-image"
                multiple={false}
                onUploadComplete={(imgs) => field.onChange(imgs[0]?.url ?? "")}
              />
            )}
          />
        </div>
      </section>

      {/* ================= FLAGS ================= */}
      <section className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-800">Flags</h2>
        </div>
        <p className="text-xs text-gray-400">
          Add tags like &quot;trending&quot;, &quot;featured&quot;,
          &quot;new-arrival&quot;
        </p>

        <Controller
          name="flags"
          control={control}
          render={({ field }) => {
            const flags: string[] = field.value || [];

            const addFlag = () => {
              const trimmed = flagInput.trim().toLowerCase();
              if (!trimmed || flags.includes(trimmed)) return;
              field.onChange([...flags, trimmed]);
              setFlagInput("");
            };

            const removeFlag = (index: number) => {
              field.onChange(flags.filter((_, i) => i !== index));
            };

            return (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {flags.map((flag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-linear-to-r from-indigo-500 to-purple-500 text-white pl-3 pr-2 py-1.5 rounded-full text-xs font-medium shadow-sm"
                    >
                      {flag}
                      <button
                        type="button"
                        onClick={() => removeFlag(i)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFlag();
                      }
                    }}
                    placeholder="e.g. trending"
                    className="input-modern flex-1"
                  />
                  <button
                    type="button"
                    onClick={addFlag}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            );
          }}
        />
      </section>

      {/* ================= GENERAL SPECIFICATIONS ================= */}
      <section className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-800">
            General Specifications
          </h2>
        </div>

        <InfoNote variant="tip" title="How to add icon names">
          Go to{" "}
          <a
            href="https://lucide.dev/icons"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            lucide.dev/icons
          </a>
          , search for an icon and copy its name in <strong>PascalCase</strong>.
          <br />
          Examples:{" "}
          <code className="bg-purple-100 px-1.5 py-0.5 rounded text-xs">
            Cpu
          </code>{" "}
          <code className="bg-purple-100 px-1.5 py-0.5 rounded text-xs">
            Battery
          </code>{" "}
          <code className="bg-purple-100 px-1.5 py-0.5 rounded text-xs">
            Wifi
          </code>{" "}
          <code className="bg-purple-100 px-1.5 py-0.5 rounded text-xs">
            HardDrive
          </code>{" "}
          <code className="bg-purple-100 px-1.5 py-0.5 rounded text-xs">
            Smartphone
          </code>
        </InfoNote>

        <AnimatePresence>
          {generalSpecifications.map((spec: any, index: number) => (
            <motion.div
              key={spec.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end bg-gray-50 p-4 rounded-xl border border-gray-100"
            >
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">
                  Icon Name
                </label>
                <input
                  {...register(`generalSpecifications.${index}.iconName`)}
                  className="input-modern py-2! text-sm"
                  placeholder="e.g. cpu"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">
                  Name
                </label>
                <input
                  {...register(`generalSpecifications.${index}.name`)}
                  className="input-modern py-2! text-sm"
                  placeholder="e.g. Processor"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">
                  Value
                </label>
                <input
                  {...register(`generalSpecifications.${index}.value`)}
                  className="input-modern py-2! text-sm"
                  placeholder="e.g. Snapdragon 8 Gen 3"
                />
              </div>
              <button
                type="button"
                onClick={() => removeGeneralSpecification(index)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={() =>
            addGeneralSpecification({ iconName: "", name: "", value: "" })
          }
          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Add Specification
        </button>
      </section>

      {/* ================= VARIANTS ================= */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg text-white font-bold">Variants</h2>
        </div>

        <AnimatePresence>
          {variants.map((variant: any, index: number) => (
            <motion.div
              key={variant.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6"
            >
              {/* Variant Header */}
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

                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>

              {/* Price & Stock */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Price
                  </label>
                  <input
                    type="number"
                    {...register(`variants.${index}.price`, {
                      valueAsNumber: true,
                    })}
                    className="input-modern"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Stock
                  </label>
                  <input
                    type="number"
                    {...register(`variants.${index}.stock`, {
                      valueAsNumber: true,
                    })}
                    className="input-modern"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Variant Images */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-600">
                    Images
                  </label>
                </div>
                <Controller
                  name={`variants.${index}.images`}
                  control={control}
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

              {/* Variant Attributes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Attributes
                </label>
                <Controller
                  name={`variants.${index}.attributes`}
                  control={control}
                  render={({ field }) => (
                    <KeyValueInput
                      value={field.value || {}}
                      onChange={field.onChange}
                      keyPlaceholder="e.g. color"
                      valuePlaceholder="e.g. Black"
                    />
                  )}
                />
              </div>

              {/* Unique Specifications per Variant */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-600">
                  Unique Specifications
                </label>

                <InfoNote variant="info" title="Unique Specs per Variant">
                  These specs are specific to this variant only. Use icon names
                  from{" "}
                  <a
                    href="https://lucide.dev/icons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    lucide.dev/icons
                  </a>{" "}
                  in <strong>PascalCase</strong> (e.g.{" "}
                  <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">
                    MemoryStick
                  </code>
                  ,{" "}
                  <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">
                    Palette
                  </code>
                  ).
                </InfoNote>

                <Controller
                  name={`variants.${index}.uniqueSpecifications`}
                  control={control}
                  render={({ field }) => {
                    const specs = field.value || [];
                    return (
                      <div className="space-y-3">
                        <AnimatePresence>
                          {specs.map((_spec: any, specIndex: number) => (
                            <motion.div
                              key={specIndex}
                              layout
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end bg-gray-50 p-3 rounded-xl"
                            >
                              <input
                                {...register(
                                  `variants.${index}.uniqueSpecifications.${specIndex}.iconName`,
                                )}
                                className="input-modern py-2! text-sm"
                                placeholder="Icon name"
                              />
                              <input
                                {...register(
                                  `variants.${index}.uniqueSpecifications.${specIndex}.name`,
                                )}
                                className="input-modern py-2! text-sm"
                                placeholder="Name"
                              />
                              <input
                                {...register(
                                  `variants.${index}.uniqueSpecifications.${specIndex}.value`,
                                )}
                                className="input-modern py-2! text-sm"
                                placeholder="Value"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeUniqueSpecFromVariant(index, specIndex)
                                }
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        <button
                          type="button"
                          onClick={() => addUniqueSpecToVariant(index)}
                          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Unique Spec
                        </button>
                      </div>
                    );
                  }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={() =>
            addVariant({
              price: 0,
              stock: 0,
              images: [],
              attributes: {},
              uniqueSpecifications: [],
            })
          }
          className="inline-flex items-center gap-2 px-5 py-3 bg-white/90 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 rounded-xl text-sm font-medium transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Variant
        </button>
      </section>

      {/* ── Submit Button ── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200"
      >
        {isSubmitting ? "Saving..." : "Create Product"}
      </button>
    </form>
  );
}
