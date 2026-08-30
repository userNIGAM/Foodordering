import generateSignature from "../utils/generateSignature.js";
import dotenv from "dotenv";

dotenv.config();

export function createEsewaPayment(amount, orderId) {
  const productCode = process.env.ESEWA_PRODUCT_CODE;
  const secretKey = process.env.ESEWA_SECRET_KEY;
  const successUrl = process.env.SUCCESS_URL; // e.g., https://yourfrontend.com/payment-success
  const failureUrl = process.env.FAILURE_URL;

  if (!productCode || !secretKey || !successUrl || !failureUrl) {
    throw new Error("Missing eSewa environment variables");
  }

  const transaction_uuid = `TXN-${orderId}-${Date.now()}`;
  const total_amount = Number(amount);

  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${productCode}`;
  const signature = generateSignature(message, secretKey);

  // ✅ Do NOT add ?transaction_uuid – let eSewa append its own ?data=...
  return {
    amount: total_amount,
    tax_amount: 0,
    total_amount: total_amount,
    transaction_uuid,
    product_code: productCode,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: successUrl, // plain URL without any query
    failure_url: failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
  };
}
