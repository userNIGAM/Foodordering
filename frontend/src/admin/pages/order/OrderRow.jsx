import React from "react";
import StatusBadge from "./StatusBadge";

const OrderRow = ({ order, updateStatus }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm font-medium">#{order.orderId}</td>

      <td className="px-6 py-4 text-sm">
        <div className="font-medium">{order.customer?.name || "N/A"}</div>
        <div className="text-gray-500">{order.customer?.email || ""}</div>
      </td>

      <td className="px-6 py-4 text-sm">
        {new Date(order.createdAt || Date.now()).toLocaleDateString()}
      </td>

      <td className="px-6 py-4 text-sm font-medium">
        Rs.{order.total?.toFixed(2) || "0.00"}
      </td>

      <td className="px-6 py-4">
        <StatusBadge status={order.status} />
      </td>

      <td className="px-6 py-4">
        <select
          value={order.status}
          onChange={(e) => updateStatus(order._id, e.target.value)}
          className="border rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="out for delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>
    </tr>
  );
};

export default OrderRow;
