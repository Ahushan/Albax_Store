import express from "express";
import {
  login,
  register,
  logout,
  refreshToken,
} from "../../controllers/auth/authController.js";
import { protect } from "../../middlewares/protect.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/refresh", refreshToken);

/* Check if user is authenticated — frontend can call this on app load */
router.get("/check", protect, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

export default router;
