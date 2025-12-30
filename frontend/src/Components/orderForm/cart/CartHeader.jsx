import React from "react";
import { X } from "lucide-react";

const CartHeader = ({ onClose, itemCount }) => (
  <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b lg:border-none">
    <div>
      <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
        Shopping Cart
      </h2>
      <p className="text-xs sm:text-sm text-gray-600 mt-1">
        {itemCount} item{itemCount !== 1 && "s"} in your cart
      </p>
    </div>
    <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
    >
      <X className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  </div>
);

export default CartHeader;
