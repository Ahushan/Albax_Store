import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} from "../../controllers/order/orderController.js";
import { protect, authorize } from "../../middlewares/protect.js";

const router = express.Router();

/* Admin only — place BEFORE /:id to avoid param conflicts */
router.get(
  "/admin/all",
  protect,
  authorize("admin", "superadmin"),
  getAllOrders,
);
router.get(
  "/admin/stats",
  protect,
  authorize("admin", "superadmin"),
  getOrderStats,
);

/* Protected — logged-in user */
router.post("/", protect, createOrder);
router.get("/me", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.patch("/:id/cancel", protect, cancelOrder);
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "superadmin"),
  updateOrderStatus,
);

export default router;
