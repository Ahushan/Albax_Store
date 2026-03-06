import CreateCategory from "../../components/forms/category/AddCategoryForm";
import CreateSubCategory from "../../components/forms/category/AddSubCategoryForm";
import CreateSubCategoryType from "../../components/forms/category/AddSubCategoryTypesForm";
import DeleteCategory from "./DeleteCategory";

const CategoryForm = () => {
  return (
    <section className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <CreateCategory />
        <CreateSubCategory />
        <CreateSubCategoryType />
      </div>
      <div className="max-w-7xl mx-auto mt-10">
        <DeleteCategory />
      </div>
    </section>
  );
};

export default CategoryForm;
