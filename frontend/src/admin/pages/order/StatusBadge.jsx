import React from "react";

const getStatusColor = (status) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "confirmed": return "bg-blue-100 text-blue-800";
    case "preparing": return "bg-purple-100 text-purple-800";
    case "out for delivery": return "bg-orange-100 text-orange-800";
    case "delivered": return "bg-green-100 text-green-800";
    case "cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
