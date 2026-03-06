import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartCount,
} from "../../controllers/cart/cartController.js";
import { protect } from "../../middlewares/protect.js";

const router = express.Router();

router.use(protect); /* All cart routes require auth */

router.get("/", getCart);
router.get("/count", getCartCount);
router.post("/", addToCart);
router.patch("/item/:itemId", updateCartItem);
router.delete("/item/:itemId", removeCartItem);
router.delete("/clear", clearCart);

export default router;
