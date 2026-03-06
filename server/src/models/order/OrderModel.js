import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variant",
  },

  name: { type: String, required: true },

  image: String,

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    orderNumber: {
      type: String,
      unique: true,
    },

    items: [orderItemSchema],

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: "IN" },
    },

    paymentMethod: {
      type: String,
      enum: ["wise", "cod", "bank_transfer"],
      default: "wise",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paymentRef: String,

    itemsTotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },

    trackingNumber: String,
    notes: String,

    deliveredAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true },
);

/* Auto-generate order number */
orderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ALB-${String(count + 1).padStart(6, "0")}`;
  }
});

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
