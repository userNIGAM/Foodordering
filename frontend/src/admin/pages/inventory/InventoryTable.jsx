import React from "react";
import InventoryRow from "./InventoryRow";
import { Package } from "lucide-react";

const InventoryTable = ({ inventory, handleStockUpdate, handleRestock }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              {["Product","Category","Stock","Low Level","Status","Cost","Value","Actions"].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y">
            {inventory.map((item) => (
              <InventoryRow
                key={item._id}
                item={item}
                handleStockUpdate={handleStockUpdate}
                handleRestock={handleRestock}
              />
            ))}
          </tbody>
        </table>
      </div>

      {inventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <p className="text-gray-500">No inventory items</p>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
