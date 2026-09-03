import { motion } from "framer-motion";

export default function OrdersTableRow({ order, formatDate }) {
  return (
    <motion.tr
      key={order.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {formatDate(order.date)}
        </div>
        <div className="text-sm text-gray-500">{order.time}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {order.items.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {item}
            </motion.div>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        ${order.amount.toFixed(2)}
      </td>
    </motion.tr>
  );
}
