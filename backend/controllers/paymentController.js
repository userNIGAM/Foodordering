import { createEsewaPayment } from "../services/esewaService.js"

export const initiatePayment = (req, res) => {

  const { amount } = req.body

  const paymentData = createEsewaPayment(amount)

  res.json({
    success: true,
    payment: paymentData
  })
}