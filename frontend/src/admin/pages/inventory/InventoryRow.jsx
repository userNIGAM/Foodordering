import React from "react";
import { Package } from "lucide-react";

const InventoryRow = ({ item, handleStockUpdate, handleRestock }) => {
  const getStatus = () => {
    if (item.currentStock === 0) return "Out";
    if (item.currentStock <= item.lowStockThreshold) return "Low";
    return "In";
  };

  const totalValue = item.currentStock * item.costPerUnit;

  return (
    <tr>
      <td className="px-4 py-3 flex items-center gap-2">
        {item.menuItemId?.image ? (
          <img src={item.menuItemId.image} className="w-10 h-10 rounded-md" />
        ) : (
          <Package className="w-10 h-10 text-gray-400" />
        )}
        <div>
          <div className="font-medium">{item.menuItemId?.name}</div>
          <div className="text-sm text-gray-500">{item.unit}</div>
        </div>
      </td>

      <td className="px-4 py-3">{item.menuItemId?.category}</td>

      <td className="px-4 py-3">
        <input
          type="number"
          value={item.currentStock}
          onChange={(e)=>handleStockUpdate(item._id, e.target.value)}
          className="w-20 border rounded px-2"
        />
      </td>

      <td className="px-4 py-3">{item.lowStockThreshold}</td>
      <td className="px-4 py-3">{getStatus()}</td>
      <td className="px-4 py-3">Rs.{item.costPerUnit?.toFixed(2)}</td>
      <td className="px-4 py-3">Rs.{totalValue.toFixed(2)}</td>

      <td className="px-4 py-3">
        <button
          onClick={()=>{
            const q = prompt("Enter quantity to add","10");
            if(q && !isNaN(q)) handleRestock(item._id,q);
          }}
          className="text-blue-600"
        >
          Restock
        </button>
      </td>
    </tr>
  );
};

export default InventoryRow;
