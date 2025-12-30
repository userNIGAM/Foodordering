import React from "react";
import { CreditCard, Tag } from "lucide-react";

const CartSummary = ({ subtotal, tax, total, itemCount, onCheckout }) => (
  <div className="lg:w-96 border-t lg:border-t-0 lg:border-l bg-gradient-to-b from-indigo-50 to-gray-100 px-4 sm:px-6 py-4 sm:py-6 lg:py-8 flex flex-col">
    <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-4 sm:mb-6">
      Order Summary
    </h3>

    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
      <div className="flex justify-between text-sm sm:text-base text-gray-700">
        <span>Subtotal ({itemCount} items)</span>
        <span className="font-medium">Rs.{subtotal}</span>
      </div>
      <div className="flex justify-between text-sm sm:text-base text-gray-700">
        <span>Shipping</span>
        <span className="text-green-600 font-medium">Free</span>
      </div>
      <div className="flex justify-between text-sm sm:text-base text-gray-700">
        <span>Tax</span>
        <span className="font-medium">Rs.{tax}</span>
      </div>
    </div>

    <div className="flex justify-between items-center py-3 sm:py-4 mb-4 sm:mb-6 border-t">
      <span className="font-bold text-gray-900 text-base sm:text-lg">
        Total
      </span>
      <span className="font-bold text-gray-900 text-lg sm:text-xl">
        Rs.{total}
      </span>
    </div>

    <div className="mt-auto space-y-3 sm:space-y-4">
      <button
        onClick={onCheckout}
        className="w-full bg-indigo-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
        Proceed to Checkout
      </button>

      <button className="w-full border border-indigo-200 text-indigo-600 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-indigo-50 flex items-center justify-center gap-2 text-sm sm:text-base">
        <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
        Apply Promo Code
      </button>
    </div>
  </div>
);

export default CartSummary;
