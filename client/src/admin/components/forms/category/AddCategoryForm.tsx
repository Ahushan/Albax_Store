import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/api/API";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function CreateCategory() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await api.post("/categories", data);
      toast.success(`Category Created: ${data.name}`);
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Category not created");
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
        // Prevent Enter key from submitting form accidentally when focused on inputs
        if (
          e.key === "Enter" &&
          e.target instanceof HTMLElement &&
          e.target.tagName === "DIV"
        ) {
          e.preventDefault();
        }
      }}
    >
      <motion.h2
        className="text-2xl font-bold text-gray-800"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        Create Category
      </motion.h2>

      {/* Category Name */}
      <motion.div
        className="flex flex-col gap-1"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <label className="text-sm font-medium text-gray-600">
          Category Name
        </label>
        <input
          placeholder="Enter Category Name"
          className="w-full p-2.5 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-black transition"
          {...register("name", { required: "Category name is required" })}
        />
        {errors.name && (
          <span className="text-xs text-red-500">
            {errors.name.message as string}
          </span>
        )}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-black text-white rounded-md 
        hover:scale-[1.02] active:scale-95 transition-all duration-300
        disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {loading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          "Create Category"
        )}
      </motion.button>
    </motion.form>
  );
}
