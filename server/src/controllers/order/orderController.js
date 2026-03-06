import Order from "../../models/order/OrderModel.js";
import { Variant } from "../../models/product/VariantModel.js";

/* CREATE ORDER */
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must have at least one item" });
    }

    /* Calculate totals */
    let itemsTotal = 0;
    for (const item of items) {
      itemsTotal += item.price * item.quantity;
    }

    const shippingCost = itemsTotal >= 999 ? 0 : 49;
    const tax = Math.round(itemsTotal * 0.18 * 100) / 100; // 18% GST
    const grandTotal = itemsTotal + shippingCost + tax;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || "wise",
      itemsTotal,
      shippingCost,
      tax,
      grandTotal,
      notes,
    });

    /* Decrease stock for each variant */
    for (const item of items) {
      if (item.variant) {
        await Variant.findByIdAndUpdate(item.variant, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Order placed",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET MY ORDERS */
export const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ORDER BY ID */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name slug gallery")
      .populate("items.variant", "attributes sku");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    /* Only owner or admin can view */
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "superadmin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADMIN: GET ALL ORDERS */
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = status ? { status } : {};

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADMIN: UPDATE ORDER STATUS */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === "delivered") order.deliveredAt = new Date();
    if (status === "cancelled") order.cancelledAt = new Date();

    await order.save();

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CANCEL ORDER — user can cancel if pending/confirmed */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Order cannot be cancelled at this stage" });
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();
    await order.save();

    /* Restore stock */
    for (const item of order.items) {
      if (item.variant) {
        await Variant.findByIdAndUpdate(item.variant, {
          $inc: { stock: item.quantity },
        });
      }
    }

    res.json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADMIN: ORDER STATS */
export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$grandTotal" },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]);

    res.json({
      success: true,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      byStatus: stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
