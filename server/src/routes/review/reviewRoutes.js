import express from "express";
import {
  createReview,
  getProductReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  adminDeleteReview,
} from "../../controllers/review/reviewController.js";
import { protect, authorize } from "../../middlewares/protect.js";

const router = express.Router();

/* Public */
router.get("/product/:productId", getProductReviews);

/* Protected — logged-in user */
router.post("/", protect, createReview);
router.get("/me", protect, getMyReviews);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

/* Admin */
router.delete(
  "/admin/:id",
  protect,
  authorize("admin", "superadmin"),
  adminDeleteReview,
);

export default router;
