import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

/* Route imports */
import Cloudinary from "./routes/cloudinary/cloudinaryRoutes.js";
import Product from "./routes/product/productRoutes.js";
import Auth from "./routes/auth/authRoutes.js";
import User from "./routes/user/userRoutes.js";
import categoryRoutes from "./routes/category/categoryRoutes.js";
import subCategoryRoutes from "./routes/category/subCategoryRoutes.js";
import subCategoryTypesRoutes from "./routes/category/subCategoryTypesRoutes.js";
import Review from "./routes/review/reviewRoutes.js";
import Order from "./routes/order/orderRoutes.js";
import Payment from "./routes/payment/paymentRoutes.js";
import Wishlist from "./routes/wishlist/wishlistRoutes.js";
import CartRoutes from "./routes/cart/cartRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

connectDB();

// Routes
app.get("/", (req, res) => {
  res.send({ message: "SERVER IS RUNNING." });
});

app.use("/api/cloudinary", Cloudinary);
app.use("/api/product", Product);
app.use("/api/auth", Auth);
app.use("/api/users", User);

app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/sub-category-types", subCategoryTypesRoutes);

app.use("/api/reviews", Review);
app.use("/api/orders", Order);
app.use("/api/payments", Payment);
app.use("/api/wishlist", Wishlist);
app.use("/api/cart", CartRoutes);

export default app;
