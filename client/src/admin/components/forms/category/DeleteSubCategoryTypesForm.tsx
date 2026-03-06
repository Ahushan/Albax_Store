import api from "@/api/API";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { BsTrash3Fill } from "react-icons/bs";
import { motion } from "framer-motion";
import { TbReload } from "react-icons/tb";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SubCategoryTypesForm = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [subCategoryTypes, setSubCategoryTypes] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ---------------- FETCH FUNCTIONS ----------------
  const fetchCategories = async () => {
    try {
      setLoading(true);
      await delay(500); // optional UX delay
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load categories",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      setLoading(true);
      await delay(500);
      const res = await api.get(`/subcategories/${categoryId}`);
      setSubCategories(res.data);
      setSelectedSubCategory(null);
      setSubCategoryTypes([]); // reset variants
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load subcategories",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategoryTypes = async (subCategoryId: string) => {
    try {
      setLoading(true);
      await delay(500);
      const res = await api.get(`/sub-category-types/${subCategoryId}`);
      setSubCategoryTypes(res.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load variants");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const deleteSubCategoryType = async (id: string) => {
    if (!selectedSubCategory) return;
    try {
      setDeletingId(id);
      await api.delete(`/sub-category-types/${id}`);
      toast.success("Sub Category Type deleted");
      await fetchSubCategoryTypes(selectedSubCategory); // fetch only current subcategory
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete sub category type",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- RELOAD ----------------
  const handleReload = async () => {
    await fetchCategories();
    if (selectedCategory) await fetchSubCategories(selectedCategory);
    if (selectedSubCategory) await fetchSubCategoryTypes(selectedSubCategory);
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // When subcategory changes, fetch variants automatically
    if (selectedSubCategory) {
      fetchSubCategoryTypes(selectedSubCategory);
    } else {
      setSubCategoryTypes([]);
    }
  }, [selectedSubCategory]);

  return (
    <section className="w-full">
      <div className="flex flex-col gap-2 bg-white rounded-xl shadow-lg p-4 min-h-[200px]">
        <div className="heading flex items-center justify-between">
          <div className="text-2xl font-bold py-2 text-gray-800">
            Delete Sub Category Type
          </div>
          <button
            onClick={handleReload}
            disabled={loading}
            className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all
            disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <TbReload />
          </button>
        </div>

        {/* CATEGORY SELECT */}
        <div className="mb-4">
          <Select
            onValueChange={(value) => {
              setSelectedCategory(value);
              fetchSubCategories(value); // fetch subcategories only
            }}
          >
            <SelectTrigger>
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
        </div>

        {/* SUBCATEGORY SELECT */}
        <div className="mb-6">
          <Select
            disabled={!selectedCategory}
            onValueChange={(value) => setSelectedSubCategory(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select SubCategory" />
            </SelectTrigger>
            <SelectContent>
              {subCategories.map((sub) => (
                <SelectItem key={sub._id} value={sub._id}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* VARIANTS */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : subCategoryTypes.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No Sub Category Types found
          </div>
        ) : (
          subCategoryTypes.map((subCategoryType) => (
            <motion.div
              key={subCategoryType._id}
              className="flex justify-between items-center bg-gray-300/30 p-2 rounded-sm hover:bg-yellow-400/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="uppercase font-bold text-sm">
                {subCategoryType.name}
              </p>

              <button
                onClick={() => deleteSubCategoryType(subCategoryType._id)}
                disabled={deletingId === subCategoryType._id}
                className="px-2 py-2.5 bg-black text-white rounded-sm 
                hover:scale-[1.02] active:scale-95 transition-all
                disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deletingId === subCategoryType._id ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <BsTrash3Fill />
                )}
              </button>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default SubCategoryTypesForm;
