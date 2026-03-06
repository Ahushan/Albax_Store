import axios from "axios";
import Payment from "../../models/payment/PaymentModel.js";
import Order from "../../models/order/OrderModel.js";

const wiseClient = () => {
  const baseURL =
    process.env.WISE_ENV === "production"
      ? "https://api.transferwise.com"
      : "https://api.sandbox.transferwise.tech";

  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${process.env.WISE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
};

/* ─────────────── HELPER: get Wise profile ID ─────────────── */
const getProfileId = async () => {
  const { data } = await wiseClient().get("/v1/profiles");
  // Use the first business profile, fallback to personal
  const profile =
    data.find((p) => p.type === "business") ||
    data.find((p) => p.type === "personal");
  return profile?.id;
};

/* ─────────────── 1. CREATE QUOTE ─────────────── */
export const createQuote = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const profileId = await getProfileId();

    const { data: quote } = await wiseClient().post(
      "/v3/profiles/" + profileId + "/quotes",
      {
        sourceCurrency: req.body.sourceCurrency || "INR",
        targetCurrency: req.body.targetCurrency || "INR",
        sourceAmount: order.grandTotal,
        payOut: "BALANCE",
      },
    );

    /* Save payment record */
    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      wiseQuoteId: quote.id,
      amount: order.grandTotal,
      currency: quote.sourceCurrency,
      targetCurrency: quote.targetCurrency,
      method: "wise",
      status: "quote_created",
      wiseFee: quote.paymentOptions?.[0]?.fee?.total || 0,
      wiseRate: quote.rate,
    });

    /* Link payment to order */
    order.paymentRef = payment._id;
    await order.save();

    res.status(201).json({ success: true, payment, quote });
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    res.status(500).json({ message: "Quote creation failed: " + msg });
  }
};

/* ─────────────── 2. CREATE RECIPIENT ─────────────── */
export const createRecipient = async (req, res) => {
  try {
    const { paymentId, recipientDetails } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const profileId = await getProfileId();

    const { data: recipient } = await wiseClient().post("/v1/accounts", {
      profile: profileId,
      accountHolderName: recipientDetails.accountHolderName,
      currency: payment.targetCurrency,
      type: recipientDetails.type || "indian",
      details: recipientDetails.details,
    });

    payment.wiseRecipientId = recipient.id;
    payment.status = "recipient_created";
    await payment.save();

    res.json({ success: true, payment, recipient });
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    res.status(500).json({ message: "Recipient creation failed: " + msg });
  }
};

/* ─────────────── 3. CREATE TRANSFER ─────────────── */
export const createTransfer = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const { data: transfer } = await wiseClient().post("/v1/transfers", {
      targetAccount: payment.wiseRecipientId,
      quoteUuid: payment.wiseQuoteId,
      customerTransactionId: payment._id.toString(),
      details: {
        reference: `ALBAX-${payment.order}`,
      },
    });

    payment.wiseTransferId = transfer.id;
    payment.status = "transfer_created";
    await payment.save();

    res.json({ success: true, payment, transfer });
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    res.status(500).json({ message: "Transfer creation failed: " + msg });
  }
};

/* ─────────────── 4. FUND TRANSFER ─────────────── */
export const fundTransfer = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const profileId = await getProfileId();

    const { data: fund } = await wiseClient().post(
      `/v3/profiles/${profileId}/transfers/${payment.wiseTransferId}/payments`,
      { type: "BALANCE" },
    );

    payment.status = "funded";
    payment.paidAt = new Date();
    await payment.save();

    /* Update order payment status */
    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: "paid",
      status: "confirmed",
    });

    res.json({ success: true, message: "Transfer funded", payment, fund });
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    res.status(500).json({ message: "Funding failed: " + msg });
  }
};

/* ─────────────── 5. GET TRANSFER STATUS ─────────────── */
export const getTransferStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (!payment.wiseTransferId) {
      return res.json({ success: true, status: payment.status, payment });
    }

    const { data } = await wiseClient().get(
      `/v1/transfers/${payment.wiseTransferId}`,
    );

    /* Sync status from Wise */
    if (
      data.status === "funds_converted" ||
      data.status === "outgoing_payment_sent"
    ) {
      payment.status = "completed";
      await payment.save();
      await Order.findByIdAndUpdate(payment.order, { paymentStatus: "paid" });
    }

    res.json({ success: true, wiseStatus: data.status, payment });
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    res.status(500).json({ message: msg });
  }
};

/* ─────────────── 6. GET PAYMENT BY ORDER ─────────────── */
export const getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      order: req.params.orderId,
    }).populate("order");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────── 7. WEBHOOK (Wise calls this) ─────────────── */
export const wiseWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.event_type === "transfers#state-change") {
      const transferId = event.data.resource.id;
      const newStatus = event.data.current_state;

      const payment = await Payment.findOne({ wiseTransferId: transferId });
      if (payment) {
        if (newStatus === "outgoing_payment_sent") {
          payment.status = "completed";
          payment.paidAt = new Date();
          await payment.save();
          await Order.findByIdAndUpdate(payment.order, {
            paymentStatus: "paid",
          });
        } else if (newStatus === "cancelled") {
          payment.status = "cancelled";
          payment.failedAt = new Date();
          await payment.save();
          await Order.findByIdAndUpdate(payment.order, {
            paymentStatus: "failed",
          });
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────── 8. ADMIN: ALL PAYMENTS ─────────────── */
export const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find()
        .populate("order", "orderNumber grandTotal status")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Payment.countDocuments(),
    ]);

    res.json({
      success: true,
      payments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
