import React, { useState } from "react";
import { Package } from "lucide-react";

const InventoryRow = ({ item, handleStockUpdate, handleRestock }) => {
  const [stock, setStock] = useState(item.currentStock);

  const getStatus = () => {
    if (stock === 0) return { label: "Out", color: "text-red-600" };
    if (stock <= item.lowStockThreshold)
      return { label: "Low", color: "text-yellow-600" };
    return { label: "In", color: "text-green-600" };
  };

  const status = getStatus();

  const costPerUnit = item.costPerUnit || 0;
  const totalValue = stock * costPerUnit;

  const handleBlurUpdate = () => {
    if (stock !== item.currentStock) {
      handleStockUpdate(item._id, stock);
    }
  };
  const menuItem = item.menuItem || item.menuItemId;

  return (
    <tr className="border-b hover:bg-gray-50">
      {/* Item Info */}
      <td className="px-4 py-3 flex items-center gap-3">
        {menuItem?.image ? (
          <img
            src={menuItem.image}
            alt={menuItem?.name}
            className="w-10 h-10 rounded-md object-cover"
          />
        ) : (
          <Package className="w-10 h-10 text-gray-400" />
        )}

        <div>
          <div className="font-medium">{menuItem?.name || "Unknown"}</div>
          <div className="text-sm text-gray-500">{item.unit}</div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3">{menuItem?.category || "-"}</td>

      {/* Stock */}
      <td className="px-4 py-3">
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          onBlur={handleBlurUpdate}
          className="w-20 border rounded px-2 py-1"
        />
      </td>

      {/* Threshold */}
      <td className="px-4 py-3">{item.lowStockThreshold}</td>

      {/* Status */}
      <td className={`px-4 py-3 font-medium ${status.color}`}>
        {status.label}
      </td>

      {/* Cost */}
      <td className="px-4 py-3">Rs. {costPerUnit.toFixed(2)}</td>

      {/* Total Value */}
      <td className="px-4 py-3 font-medium">Rs. {totalValue.toFixed(2)}</td>

      {/* Restock */}
      <td className="px-4 py-3">
        <button
          onClick={() => {
            const q = prompt("Enter quantity to add", "10");

            if (q && !isNaN(q) && Number(q) > 0) {
              handleRestock(item._id, Number(q));
            }
          }}
          className="text-blue-600 hover:underline"
        >
          Restock
        </button>
      </td>
    </tr>
  );
};

export default InventoryRow;
