import React from "react";

const CartSummary = ({ itemsCount, total }) => (
  <div className="fixed top-20 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
    <div className="flex items-center">
      <i className="fas fa-shopping-cart text-[#8B2635] mr-2"></i>
      <span className="font-bold">{itemsCount} items</span>
    </div>
    <button className="mt-2 bg-[#8B2635] text-white px-3 py-1 rounded text-sm w-full">
      View Cart (${total.toFixed(2)})
    </button>
  </div>
);

export default CartSummary;
