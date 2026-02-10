import React from "react";
import { Download, BarChart3 } from "lucide-react";

const InventoryHeader = ({ showReport, setShowReport, reportData, fetchInventoryReport }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Inventory Management
        </h2>
        <p className="text-sm text-gray-600">
          Manage stock levels and track inventory
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setShowReport(!showReport);
            if (!reportData) fetchInventoryReport();
          }}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          {showReport ? "Hide Report" : "View Report"}
        </button>

        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>
    </div>
  );
};

export default InventoryHeader;
