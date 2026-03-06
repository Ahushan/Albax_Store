import Wishlist from "../../models/wishlist/WishlistModel.js";

/* TOGGLE WISHLIST (add / remove) */
export const toggleWishlist = async (req, res) => {
  try {
    const { product, variant } = req.body;

    const existing = await Wishlist.findOne({
      user: req.user._id,
      product,
    });

    if (existing) {
      await Wishlist.findByIdAndDelete(existing._id);
      return res.json({
        success: true,
        message: "Removed from wishlist",
        wishlisted: false,
      });
    }

    await Wishlist.create({
      user: req.user._id,
      product,
      variant,
    });

    res
      .status(201)
      .json({ success: true, message: "Added to wishlist", wishlisted: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET MY WISHLIST */
export const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id })
      .populate({
        path: "product",
        select: "name slug gallery baseVariant isActive",
        populate: { path: "baseVariant", select: "price comparePrice images" },
      })
      .populate("variant", "attributes price comparePrice images sku")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CHECK IF PRODUCT IS WISHLISTED */
export const isWishlisted = async (req, res) => {
  try {
    const item = await Wishlist.findOne({
      user: req.user._id,
      product: req.params.productId,
    });

    res.json({ success: true, wishlisted: !!item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* REMOVE FROM WISHLIST */
export const removeFromWishlist = async (req, res) => {
  try {
    const deleted = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CLEAR WISHLIST */
export const clearWishlist = async (req, res) => {
  try {
    await Wishlist.deleteMany({ user: req.user._id });
    res.json({ success: true, message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
