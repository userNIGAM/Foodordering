import Payment from "../models/Payment.js";
import { createEsewaPayment } from "../services/esewaService.js";

export const initiatePayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    console.log("🔹 Initiate request:", { amount, orderId });

    // Validate input
    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Amount and orderId are required",
      });
    }

    // Generate eSewa payment data
    const paymentData = createEsewaPayment(amount, orderId);
    console.log("🔹 Generated payment data:", paymentData);

    // Save payment record
    await Payment.create({
      orderId,
      transaction_uuid: paymentData.transaction_uuid,
      amount,
      status: "pending",
    });
    console.log("✅ Payment record saved.");

    res.json({
      success: true,
      payment: paymentData,
      transaction_uuid: paymentData.transaction_uuid,
    });
  } catch (error) {
    // Log full error stack
    console.error("❌ Payment initiate error:", error);
    res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      // Include error details for debugging (remove in production)
      error: error.message,
      stack: error.stack,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { transaction_uuid, referenceId } = req.body;
    console.log("🔹 Verify request:", { transaction_uuid, referenceId });

    if (!transaction_uuid) {
      return res.status(400).json({
        success: false,
        message: "Transaction UUID is required",
      });
    }

    const payment = await Payment.findOne({ transaction_uuid });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status === "success") {
      return res.json({
        success: true,
        orderId: payment.orderId,
        amount: payment.amount,
        message: "Already verified",
      });
    }

    // Update payment
    payment.status = "success";
    payment.referenceId = referenceId || null;
    await payment.save();

    res.json({
      success: true,
      orderId: payment.orderId,
      amount: payment.amount,
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

export const paymentFailed = async (req, res) => {
  try {
    const { transaction_uuid } = req.body;
    if (!transaction_uuid) {
      return res.status(400).json({
        success: false,
        message: "Transaction UUID is required",
      });
    }

    const payment = await Payment.findOne({ transaction_uuid });
    if (payment) {
      payment.status = "failed";
      await payment.save();
    }

    res.json({ success: false });
  } catch (error) {
    console.error("❌ Payment failure error:", error);
    res.status(500).json({
      success: false,
      message: "Payment failure processing failed",
      error: error.message,
    });
  }
};
