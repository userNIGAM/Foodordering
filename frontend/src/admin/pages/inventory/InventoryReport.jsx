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
          <p className="font-semibold">Low Stock Items</p>
          <p className="text-2xl font-bold">{reportData.lowStockItems}</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <p className="font-semibold">Out of Stock</p>
          <p className="text-2xl font-bold">{reportData.outOfStockItems}</p>
        </div>
      </div>

      {/* Optional: display category breakdown */}
      {reportData.report && reportData.report.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">By Category</h4>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Value</th>
                <th>Low Stock</th>
                <th>Out of Stock</th>
              </tr>
            </thead>
            <tbody>
              {reportData.report.map((cat) => (
                <tr key={cat.category}>
                  <td>{cat.category}</td>
                  <td>${cat.totalValue.toFixed(2)}</td>
                  <td>{cat.lowStockItems}</td>
                  <td>{cat.outOfStockItems}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryReport;
