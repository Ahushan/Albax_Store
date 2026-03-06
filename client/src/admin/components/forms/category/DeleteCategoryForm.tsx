import api from "@/api/API";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsTrash3Fill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { TbReload } from "react-icons/tb";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Category = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    try {
      setLoading(true);
      await delay(500); // optional UX delay
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

  // ---------------- DELETE CATEGORY ----------------
  const deleteCategory = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");

      // remove from local state immediately for smooth UX
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete category",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- RELOAD ----------------
  const handleReload = async () => {
    await fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col gap-2 bg-white no-scrollbar min-h-[300px] max-h-[calc(100vh-200px)] overflow-y-auto rounded-xl shadow-lg p-4 sm:p-6 w-full">
      {/* HEADER + RELOAD */}
      <div className="heading flex items-center justify-between">
        <div className="text-2xl font-bold py-2 text-gray-800">
          Delete Category
        </div>
        <button
          onClick={handleReload}
          disabled={loading}
          className="p-3 bg-black text-white rounded-full 
          hover:scale-[1.02] active:scale-95 transition-all duration-300
          disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <TbReload />
        </button>
      </div>

      {/* CATEGORY LIST */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No categories found
        </div>
      ) : (
        <AnimatePresence>
          {categories.map((cat) => (
            <motion.div
              key={cat._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-row justify-between gap-3 bg-gray-300/30 transition-all duration-300 p-2 rounded-sm hover:bg-yellow-400/50 mb-2"
            >
              <p className="uppercase font-bold flex items-center w-full text-sm text-center">
                {cat.name}
              </p>

              <button
                onClick={() => deleteCategory(cat._id)}
                disabled={deletingId === cat._id}
                className="w-fit px-2 py-2.5 bg-black text-white rounded-sm 
                hover:scale-[1.02] active:scale-95 transition-all
                disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deletingId === cat._id ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <BsTrash3Fill />
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Category;
