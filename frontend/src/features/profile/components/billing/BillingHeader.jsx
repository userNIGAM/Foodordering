import { motion } from "framer-motion";
import { Filter, Download } from "lucide-react";

export default function BillingHeader({ ordersCount, onDownloadPDF }) {
  return (
    <motion.div
      className="mb-6 flex justify-between items-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-sm text-slate-600">
        Last 30 days • <span className="font-medium">{ordersCount} orders</span>
      </div>
      <div className="flex space-x-2">
        <button className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1">
          <Filter size={16} /> Filter
        </button>
        <button
          onClick={onDownloadPDF}
          className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
        >
          <Download size={16} /> Download PDF
        </button>
      </div>
    </motion.div>
  );
}
