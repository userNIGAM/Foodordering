import React from "react";
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ item, quantity, addToCart }) {
  const handleAdd = () => {
    addToCart({ ...item, quantity });
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center mb-6"
    >
      <ShoppingCart size={20} className="mr-2" />
      Add to Cart - ${(Number(item.price ?? 0) * quantity).toFixed(2)}
    </button>
  );
}
