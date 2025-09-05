import React from "react";
import { ShoppingCart } from "lucide-react";

const CartSummary = ({ itemsCount, total, onViewCart }) => (
  <div className="fixed top-20 right-4 bg-white p-4 rounded-xl shadow-lg z-10 w-64 border border-slate-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <ShoppingCart className="w-5 h-5 text-[#8B2635] mr-2" />
        <span className="font-semibold text-slate-800">{itemsCount} items</span>
      </div>
      <span className="text-sm text-slate-500">₹{total.toFixed(2)}</span>
    </div>
    <button
      onClick={onViewCart}
      className="mt-3 w-full bg-[#8B2635] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2E3532] transition"
    >
      View Cart
    </button>
  </div>
);

export default CartSummary;
