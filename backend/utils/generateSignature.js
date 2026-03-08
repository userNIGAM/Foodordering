import { createHmac } from "crypto"

function generateSignature(message, secret) {
  return createHmac("sha256", secret)
    .update(message)
    .digest("base64")
}

export default generateSignature