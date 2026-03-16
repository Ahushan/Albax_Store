import Home from "@/pages/home/Home";
import { Route, Routes } from "react-router-dom";
import ProductDetails from "../pages/product/ProductDetails";
import Products from "@/pages/product/Products";
import Checkout from "@/pages/checkout/Checkout";
import Order from "@/pages/order/Order";
import OrderDetail from "@/pages/order/OrderDetail";
import Register from "@/pages/auth/register/Register";
import Login from "@/pages/auth/login/Login";
import Cart from "@/pages/cart/Cart";
import Wishlist from "@/pages/wishlist/Wishlist";
import Profile from "@/pages/profile/Profile";
import NotFound from "@/pages/not-found/NotFound";
import ProtectedRoute from "./Protected";
import AdminRoutes from "@/admin/routes/AdminRoutes";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:productId" element={<ProductDetails />} />

        {/* Protected User Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole={["admin", "superadmin"]}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;