import React from "react";
import { CreditCard } from "lucide-react";

const CartEmpty = () => (
  <div className="flex flex-col items-center justify-center h-56 sm:h-64 text-gray-500">
    <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
      <CreditCard className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400" />
    </div>
    <p className="text-base sm:text-lg font-medium">Your cart is empty</p>
    <p className="text-xs sm:text-sm mt-2 text-gray-500">
      Add some delicious items to get started
    </p>
  </div>
);

export default CartEmpty;
