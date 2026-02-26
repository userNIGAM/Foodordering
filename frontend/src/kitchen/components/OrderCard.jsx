import React from "react";
import { Clock, AlertCircle, ChefHat, CheckCircle, Zap } from "lucide-react";

const OrderCard = ({ order, onAction, actionLoading }) => {
  const getStatusColor = (status) => {
    const colors = {
      assigned_to_kitchen: "bg-gray-100 text-gray-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-yellow-100 text-yellow-800",
      prepared: "bg-green-100 text-green-800",
      issue: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: <CheckCircle size={20} />,
      preparing: <Zap size={20} />,
      prepared: <CheckCircle size={20} />,
      issue: <AlertCircle size={20} />,
    };
    return icons[status] || <Clock size={20} />;
  };

  const getTimeElapsed = (createdAt) => {
    const now = new Date();
    const orderDate = new Date(createdAt);
    const minutes = Math.floor((now - orderDate) / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Order #{order.orderId || order._id.slice(-8)}
          </h3>
          <p className="text-sm text-gray-600">{order.customer?.name}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusIcon(order.status)}
          {order.status.replace("_", " ").toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div>
          <p className="text-gray-600">Items</p>
          <p className="font-semibold text-gray-900">{order.items?.length}</p>
        </div>
        <div>
          <p className="text-gray-600">Time</p>
          <p className="font-semibold text-gray-900">
            {getTimeElapsed(order.createdAt)}
          </p>
        </div>
      </div>

      {order.customer?.specialInstructions && (
        <div className="bg-blue-50 p-2 rounded mb-3 text-sm">
          <p className="text-gray-700 italic">
            📝 {order.customer.specialInstructions}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {order.status === "confirmed" && (
          <button
            onClick={() => onAction("prepare", order._id)}
            disabled={actionLoading}
            className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ChefHat size={16} />
            Start Prep
          </button>
        )}
        {order.status === "preparing" && (
          <button
            onClick={() => onAction("prepared", order._id)}
            disabled={actionLoading}
            className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            Mark Done
          </button>
        )}
        {(order.status === "confirmed" || order.status === "preparing") && (
          <button
            onClick={() => onAction("issue", order._id)}
            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm flex items-center justify-center gap-2"
          >
            <AlertCircle size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
