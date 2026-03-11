import Payment from "../models/payment.js"
import { createEsewaPayment } from "../services/esewaService.js"

export const initiatePayment = async (req, res) => {

  try {

    const { amount, orderId } = req.body

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Amount and orderId required"
      })
    }

    const paymentData = createEsewaPayment(amount, orderId)

    await Payment.create({
      orderId,
      transaction_uuid: paymentData.transaction_uuid,
      amount,
      status: "pending"
    })

    res.json({
      success: true,
      payment: paymentData
    })

  } catch (error) {

    console.error("Payment initiate error:", error)

    res.status(500).json({
      success: false,
      message: "Payment initiation failed"
    })

  }
}
export const verifyPayment = async (req, res) => {

  try {

    const { transaction_uuid, referenceId } = req.body

    const payment = await Payment.findOne({
      transaction_uuid
    })

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      })
    }

    payment.status = "success"
    payment.referenceId = referenceId || null

    await payment.save()

    res.json({
      success: true
    })

  } catch (error) {

    console.error("Verify payment error:", error)

    res.status(500).json({
      success: false
    })

  }

}
export const paymentFailed = async (req, res) => {

  try {

    const { transaction_uuid } = req.body

    const payment = await Payment.findOne({
      transaction_uuid
    })

    if (payment) {

      payment.status = "failed"

      await payment.save()

    }

    res.json({
      success: false
    })

  } catch (error) {

    console.error("Payment failure error:", error)

    res.status(500).json({
      success: false
    })

  }

}