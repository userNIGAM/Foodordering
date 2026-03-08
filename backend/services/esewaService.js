import generateSignature from "../utils/generateSignature.js"
import dotenv from "dotenv"
dotenv.config()
// require("dotenv").config()

export function createEsewaPayment(amount) {

  const transaction_uuid = "TXN-" + Date.now()

  const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`

  const signature = generateSignature(
    message,
    process.env.ESEWA_SECRET_KEY
  )

  return {
    amount: amount,
    tax_amount: 0,
    total_amount: amount,
    transaction_uuid: transaction_uuid,
    product_code: process.env.ESEWA_PRODUCT_CODE,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: process.env.SUCCESS_URL,
    failure_url: process.env.FAILURE_URL,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: signature
  }
}