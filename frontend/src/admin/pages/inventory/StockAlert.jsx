import React from "react";
import { AlertTriangle } from "lucide-react";

const StockAlert = ({ inventory }) => {
  const critical = inventory.filter(
    (i) => i.currentStock === 0 || i.currentStock <= i.lowStockThreshold
  );

  if (critical.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
      <AlertTriangle className="h-5 w-5 text-yellow-400" />
      <div>
        <h3 className="font-medium text-yellow-800">Stock Alerts</h3>
        <p className="text-sm text-yellow-700">
          Some items are low or out of stock. Please restock.
        </p>
      </div>
    </div>
  );
};

export default StockAlert;
