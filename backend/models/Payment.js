import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
{
  orderId: {
    type: String,
    required: true
  },

  transaction_uuid: {
    type: String,
    required: true,
    unique: true
  },

  amount: {
    type: Number,
    required: true
  },

  paymentMethod: {
    type: String,
    default: "esewa"
  },

  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },

  referenceId: {
    type: String,
    default: null
  },

  rawResponse: {
    type: Object,
    default: null
  }
},
{ timestamps: true }
)

export default mongoose.model("Payment", paymentSchema)