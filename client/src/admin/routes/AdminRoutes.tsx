import { Route, Routes } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import CategoryForm from "../pages/category/AddCategory";
import Dashboard from "../pages/dashboard/Dashboard";
import AddProductForm from "../components/forms/product/AddProduct";
import AdminOrders from "../pages/order/Orders";
import AdminUsers from "../pages/users/AdminUsers";
import AdminReviews from "../pages/reviews/AdminReviews";
import DemoProductForm from "../pages/demo/ProductForm";
import DemoProductList from "../pages/demo/ProductList";
import DemoProductDetails from "../pages/demo/ProductDetails";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route
          path="category"
          element={
            <section className="bg-linear-to-br from-gray-400 via-black to-gray-900 min-h-screen">
              <CategoryForm />
            </section>
          }
        />
        <Route
          path="product"
          element={
            <section className="bg-linear-to-br from-gray-400 via-black to-gray-900 min-h-screen">
              <AddProductForm />
            </section>
          }
        />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reviews" element={<AdminReviews />} />

        {/* Demo routes */}
        <Route
          path="create-product"
          element={
            <section className="bg-linear-to-br from-gray-400 via-black to-gray-900 min-h-screen">
              <DemoProductForm />
            </section>
          }
        />
        <Route
          path="product-list"
          element={
            <section className="bg-linear-to-br from-gray-400 via-black to-gray-900 min-h-screen">
              <DemoProductList />
            </section>
          }
        />
        <Route
          path="product-details/:id"
          element={
            <section className="bg-linear-to-br from-gray-400 via-black to-gray-900 min-h-screen">
              <DemoProductDetails />
            </section>
          }
        />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
