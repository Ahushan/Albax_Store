import Cart from "../../models/cart/CartModel.js";

/* GET CART */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: "items.product",
        select: "name slug gallery isActive",
      })
      .populate(
        "items.variant",
        "attributes price comparePrice stock images sku",
      );

    if (!cart) {
      cart = { items: [], itemCount: 0, cartTotal: 0 };
      return res.json({ success: true, cart });
    }

    /* Calculate totals */
    let cartTotal = 0;
    let itemCount = 0;
    for (const item of cart.items) {
      const price = item.variant?.price || 0;
      cartTotal += price * item.quantity;
      itemCount += item.quantity;
    }

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        items: cart.items,
        itemCount,
        cartTotal,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADD TO CART */
export const addToCart = async (req, res) => {
  try {
    const { product, variant, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product, variant, quantity }],
      });
      return res
        .status(201)
        .json({ success: true, message: "Added to cart", cart });
    }

    /* Check if item already exists in cart */
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === product &&
        (item.variant?.toString() || "") === (variant || ""),
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ product, variant, quantity });
    }

    await cart.save();
    res.json({ success: true, message: "Added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE ITEM QUANTITY */
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res.json({ success: true, message: "Quantity updated", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* REMOVE ITEM FROM CART */
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    res.json({ success: true, message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CLEAR CART */
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET CART COUNT (lightweight) */
export const getCartCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const count = cart
      ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
      : 0;

    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
