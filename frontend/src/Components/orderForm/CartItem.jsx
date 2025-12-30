import React from "react";

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <div className="flex justify-between items-center mb-3 pb-3 border-b">
    <div>
      <h4 className="font-medium">{item.name}</h4>
      <p className="text-sm text-gray-600">
        ${item.price} x {item.quantity}
      </p>
    </div>

    <div className="flex items-center">
      <button
        onClick={() => updateQuantity(item._id, item.quantity - 1)}
        className="bg-gray-200 px-2 py-1 rounded-l"
      >
        -
      </button>

      <span className="px-3 py-1 bg-gray-100">{item.quantity}</span>

      <button
        onClick={() => updateQuantity(item._id, item.quantity + 1)}
        className="bg-gray-200 px-2 py-1 rounded-r"
      >
        +
      </button>

      <button
        onClick={() => removeFromCart(item._id)}
        className="ml-3 text-red-500 hover:text-red-700"
      >
        Remove
      </button>
    </div>
  </div>
);

export default CartItem;
