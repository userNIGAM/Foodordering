import { motion } from "framer-motion";

export default function BillingSummary({ totalAmount, onPayment }) {
  return (
    <motion.div
      className="mt-8 p-6 bg-blue-50 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Total Amount Due
          </h3>
          <p className="text-sm text-slate-600">
            Payment for last 30 days orders
          </p>
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold text-blue-700">
            ${totalAmount.toFixed(2)}
          </h3>
          <button
            onClick={onPayment}
            className="mt-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Pay Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
