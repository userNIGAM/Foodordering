import React from "react";
import InventoryRow from "./InventoryRow";
import { Package } from "lucide-react";

const InventoryTable = ({
  inventory = [],
  handleStockUpdate,
  handleRestock,
  loading = false,
}) => {
  const headers = [
    "Product",
    "Category",
    "Stock",
    "Low Level",
    "Status",
    "Cost",
    "Value",
    "Actions",
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[800px]">

          {/* Table Header */}
          <thead className="bg-gray-50 border-b">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y">
            {!loading && inventory.length > 0 && (
              inventory.map((item) => (
                <InventoryRow
                  key={item._id}
                  item={item}
                  handleStockUpdate={handleStockUpdate}
                  handleRestock={handleRestock}
                />
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* Empty State */}
      {!loading && inventory.length === 0 && (
        <div className="text-center py-14">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500 text-sm">
            No inventory items found
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-14 text-gray-500 text-sm">
          Loading inventory...
        </div>
      )}

    </div>
  );
};

export default InventoryTable;