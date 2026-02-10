import React from "react";

const InventoryReport = ({ reportData }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Inventory Summary Report</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-semibold">Total Value</p>
          <p className="text-2xl font-bold">${reportData.totalValue.toFixed(2)}</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="font-semibold">Low Stock</p>
          <p className="text-2xl font-bold">
            {reportData.report.reduce((s,c)=>s+c.lowStockItems,0)}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <p className="font-semibold">Out of Stock</p>
          <p className="text-2xl font-bold">
            {reportData.report.reduce((s,c)=>s+c.outOfStockItems,0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;
