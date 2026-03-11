export const ESEWA_CONFIG = {

  PRODUCT_CODE: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",

  SECRET_KEY: process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q",

  PAYMENT_URL:
    "https://rc-epay.esewa.com.np/api/epay/main/v2/form",

  SUCCESS_URL:
    "http://localhost:5173/payment-success",

  FAILURE_URL:
    "http://localhost:5173/payment-failed"

}