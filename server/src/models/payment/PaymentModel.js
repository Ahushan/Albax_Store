import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* Wise-specific fields */
    wiseQuoteId: String,
    wiseTransferId: String,
    wiseRecipientId: String,

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    targetCurrency: {
      type: String,
      default: "INR",
    },

    method: {
      type: String,
      enum: ["wise", "cod", "bank_transfer"],
      default: "wise",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "quote_created",
        "recipient_created",
        "transfer_created",
        "funded",
        "completed",
        "failed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },

    wiseFee: Number,
    wiseRate: Number,

    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },

    paidAt: Date,
    failedAt: Date,
  },
  { timestamps: true },
);

paymentSchema.index({ wiseTransferId: 1 });

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);
