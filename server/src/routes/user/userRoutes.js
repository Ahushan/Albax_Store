import express from "express";
import {
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  toggleUserStatus,
} from "../../controllers/user/userController.js";
import { protect, authorize } from "../../middlewares/protect.js";

const router = express.Router();

/* Protected — logged-in user */
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.put("/me/password", protect, changePassword);

/* Admin only */
router.get("/", protect, authorize("admin", "superadmin"), getAllUsers);
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "superadmin"),
  toggleUserStatus,
);

export default router;
