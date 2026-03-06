import express from "express";
import {
  toggleWishlist,
  getWishlist,
  isWishlisted,
  removeFromWishlist,
  clearWishlist,
} from "../../controllers/wishlist/wishlistController.js";
import { protect } from "../../middlewares/protect.js";

const router = express.Router();

router.use(protect); /* All wishlist routes require auth */

router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);
router.get("/check/:productId", isWishlisted);
router.delete("/clear", clearWishlist);
router.delete("/:id", removeFromWishlist);

export default router;
