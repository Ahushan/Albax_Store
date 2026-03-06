import api from "@/api/API";
import {
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { BsTrash3Fill } from "react-icons/bs";
import { TbReload } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SubCategory = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ---------------- FETCH FUNCTIONS ----------------
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      await delay(500); // optional UX delay
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load categories",
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      setLoadingSubCategories(true);
      await delay(500);
      const res = await api.get(`/subcategories/${categoryId}`);
      setSubCategories(res.data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load subcategories",
      );
    } finally {
      setLoadingSubCategories(false);
    }
  };

  // ---------------- DELETE FUNCTION ----------------
  const deleteSubCategory = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`/subcategories/${id}`);
      toast.success("SubCategory deleted");

      // remove from local state immediately for smooth UX
      setSubCategories((prev) => prev.filter((sub) => sub._id !== id));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete subcategory",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- RELOAD FUNCTION ----------------
  const handleReload = async () => {
    await fetchCategories();
    if (selectedCategory) await fetchSubCategories(selectedCategory);
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="w-full">
      <div className="flex flex-col gap-2 bg-white no-scrollbar min-h-[300px] max-h-[calc(100vh-200px)] overflow-y-auto rounded-xl shadow-lg p-4 sm:p-6 w-full">
        {/* HEADER + RELOAD */}
        <div className="heading flex items-center justify-between">
          <div className="text-2xl font-bold py-2 text-gray-800">
            Delete SubCategory
          </div>
          <button
            onClick={handleReload}
            disabled={loadingCategories || loadingSubCategories}
            className="p-3 bg-black text-white rounded-full 
            hover:scale-[1.02] active:scale-95 transition-all duration-300
            disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <TbReload />
          </button>
        </div>

        {/* CATEGORY SELECT */}
        <div className="w-full mb-4">
          {loadingCategories ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : (
            <Select
              onValueChange={(value) => {
                setSelectedCategory(value);
                fetchSubCategories(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
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
        </div>

        {/* SUBCATEGORY LIST */}
        {loadingSubCategories ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : subCategories.length === 0 && selectedCategory ? (
          <div className="text-center text-gray-500 py-10">
            No subcategories found
          </div>
        ) : (
          <AnimatePresence>
            {subCategories.map((sub) => (
              <motion.div
                key={sub._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center bg-gray-300/30 p-2 rounded-sm hover:bg-yellow-400/50 transition-all mb-2"
              >
                <p className="uppercase font-bold text-sm">{sub.name}</p>

                <button
                  onClick={() => deleteSubCategory(sub._id)}
                  disabled={deletingId === sub._id}
                  className="px-2 py-2.5 bg-black text-white rounded-sm 
                  hover:scale-[1.02] active:scale-95 transition-all
                  disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deletingId === sub._id ? (
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
    </section>
  );
};

export default SubCategory;
