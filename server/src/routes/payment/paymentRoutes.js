import express from "express";
import {
  createQuote,
  createRecipient,
  createTransfer,
  fundTransfer,
  getTransferStatus,
  getPaymentByOrder,
  wiseWebhook,
  getAllPayments,
} from "../../controllers/payment/paymentController.js";
import { protect, authorize } from "../../middlewares/protect.js";

const router = express.Router();

/* Webhook — called by Wise (no auth needed) */
router.post("/webhook", wiseWebhook);

/* Protected — logged-in user */
router.post("/quote", protect, createQuote);
router.post("/recipient", protect, createRecipient);
router.post("/transfer", protect, createTransfer);
router.post("/fund", protect, fundTransfer);
router.get("/status/:id", protect, getTransferStatus);
router.get("/order/:orderId", protect, getPaymentByOrder);

/* Admin */
router.get("/", protect, authorize("admin", "superadmin"), getAllPayments);

export default router;
