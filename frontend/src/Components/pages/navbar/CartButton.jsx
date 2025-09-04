import React from "react";
import { ShoppingCart } from "lucide-react";

const CartButton = ({ onClick, cartItemsCount }) => (
  <button
    onClick={onClick}
    className="text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center group relative"
  >
    <ShoppingCart className="h-4 w-4 mr-2 opacity-70 group-hover:opacity-100" />
    Cart
    {cartItemsCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {cartItemsCount}
      </span>
    )}
  </button>
);

export default CartButton;
