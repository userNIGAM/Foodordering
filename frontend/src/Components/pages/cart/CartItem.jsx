import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

const getItemId = (item) => item.id || item._id;

const CartItem = ({ item, increaseQty, decreaseQty, removeItem }) => {
  const itemId = getItemId(item);

  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-lg truncate">
          {item.name}
        </h3>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => decreaseQty(itemId)}
              className="p-1 bg-white rounded-md shadow-sm hover:bg-gray-50"
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <span className="font-medium text-gray-900 w-6 sm:w-8 text-center text-sm sm:text-base">
              {item.quantity}
            </span>
            <button
              onClick={() => increaseQty(itemId)}
              className="p-1 bg-white rounded-md shadow-sm hover:bg-gray-50"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Price */}
          <p className="font-semibold text-gray-900 text-sm sm:text-lg">
            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* Remove */}
        <button
          onClick={() => removeItem(itemId)}
          className="mt-2 sm:mt-3 text-red-500 hover:text-red-700 flex items-center text-xs sm:text-sm"
        >
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
