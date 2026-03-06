import CategoryForm from "@/admin/components/forms/category/DeleteCategoryForm";
import SubCategoryForm from "@/admin/components/forms/category/DeleteSubCategoryForm";
import SubCategoryTypesForm from "@/admin/components/forms/category/DeleteSubCategoryTypesForm";

const DeleteCategory = () => {
  return (
    <section className="w-full p-4 rounded-xl sm:p-6">
      <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <CategoryForm />
        <SubCategoryForm />
        <SubCategoryTypesForm />
      </div>
    </section>
  );
};

export default DeleteCategory;
