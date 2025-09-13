import React from "react";
import { Plus, Minus } from "lucide-react";

export default function QuantitySelector({ quantity, setQuantity }) {
  return (
    <div className="flex items-center mb-6">
      <span className="mr-4 font-medium text-gray-700">Quantity:</span>
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-2 text-gray-600 hover:bg-gray-100"
        >
          <Minus size={16} />
        </button>
        <span className="px-4 py-2 font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="p-2 text-gray-600 hover:bg-gray-100"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
