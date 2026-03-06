import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import api from "@/api/API";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TbReload } from "react-icons/tb";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
}

interface FormValues {
  name: string;
  subcategoryId: string;
  categoryId: string;
}

export default function CreateVariant() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch categories",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch Subcategories by Category
  const fetchSubcategories = async (categoryId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/subcategories/${categoryId}`);
      setSubcategories(res.data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch subcategories",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
      setSubcategories([]);
      return;
    }
    fetchSubcategories(selectedCategoryId);
  }, [selectedCategoryId]);

  const handleReload = () => {
    setLoading(true);
    setTimeout(async () => {
      await fetchCategories();
      setSelectedCategoryId("");
      setSubcategories([]);
      reset({ name: "", categoryId: "", subcategoryId: "" });
      setLoading(false);
    }, 1000);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      await api.post("/sub-category-types", {
        name: data.name,
        subCategoryId: data.subcategoryId,
      });
      toast.success("Sub Category Type created");

      // Reset form with animation
      reset({ name: "", categoryId: "", subcategoryId: "" });
      setSelectedCategoryId("");
      setSubcategories([]);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Sub Category Type not created",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl shadow-lg p-6 w-full space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onKeyDown={(e) => {
        // Prevent form submit on Enter inside Select triggers
        if (
          e.key === "Enter" &&
          e.target instanceof HTMLElement &&
          e.target.tagName === "DIV"
        ) {
          e.preventDefault();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Create Sub Category Type
        </h2>
        <button
          type="button"
          className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all"
          onClick={handleReload}
        >
          <TbReload />
        </button>
      </div>

      {/* Category Select */}
      <motion.div
        className="flex flex-col gap-1"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label className="text-sm font-medium text-gray-600">
          Select Category
        </label>
        <Controller
          name="categoryId"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedCategoryId(value);
              }}
              value={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-black">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && (
          <span className="text-xs text-red-500">
            {errors.categoryId.message}
          </span>
        )}
      </motion.div>

      {/* SubCategory Select */}
      <motion.div
        className="flex flex-col gap-1"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <label className="text-sm font-medium text-gray-600">
          Select SubCategory
        </label>
        <Controller
          name="subcategoryId"
          control={control}
          rules={{ required: "SubCategory is required" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!selectedCategoryId}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-black disabled:bg-gray-100">
                <SelectValue placeholder="Select SubCategory" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((sub) => (
                  <SelectItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.subcategoryId && (
          <span className="text-xs text-red-500">
            {errors.subcategoryId.message}
          </span>
        )}
      </motion.div>

      {/* Sub Category Type Name Input */}
      <motion.div
        className="flex flex-col gap-1"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <label className="text-sm font-medium text-gray-600">
          Sub Category Type Name
        </label>
        <input
          placeholder="Enter Sub Category Type Name"
          className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition"
          {...register("name", {
            required: "Sub Category Type name is required",
          })}
        />
        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}
      </motion.div>

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-black text-white rounded-md hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:bg-black/10 disabled:cursor-not-allowed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {loading ? (
          <Loader2 className="mx-auto animate-spin" />
        ) : (
          "Create Sub Category Type"
        )}
      </motion.button>
    </motion.form>
  );
}
