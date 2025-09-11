import React from "react";

const LowStockAlerts = ({ alerts }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Low Stock Alerts
    </h3>
    <div className="space-y-3">
      {alerts && alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{alert.name}</p>
              <p className="text-sm text-gray-600">
                Current: {alert.quantity} | Threshold: {alert.threshold}
              </p>
            </div>
            <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
              Low Stock
            </span>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No low stock items</p>
      )}
    </div>
  </div>
);

export default LowStockAlerts;
