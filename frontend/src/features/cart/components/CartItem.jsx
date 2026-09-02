import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "../../UI/Image";

const getItemId = (item) => item._id || item.id;

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  const itemId = getItemId(item);

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(itemId, item.quantity + 1);
  };

  const handleRemove = () => {
    removeFromCart(itemId);
  };

  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      {/* Product Image */}
      <Image
        src={item.image}
        alt={item.name}
        className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg object-cover flex-shrink-0"
        loading="lazy"
      />

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-lg truncate">
          {item.name}
        </h3>

        {/* Unit Price */}
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Rs.{Number.parseFloat(item.price || 0).toFixed(2)} each
        </p>

        <div className="flex items-center justify-between mt-2 sm:mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="p-1 sm:p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            <span className="font-medium text-gray-900 w-6 sm:w-8 text-center text-sm sm:text-base">
              {item.quantity}
            </span>

            <button
              onClick={handleIncrease}
              className="p-1 sm:p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50 transition"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Item Total */}
          <p className="font-semibold text-gray-900 text-sm sm:text-lg">
            Rs.
            {(
              Number.parseFloat(item.price || 0) * Number(item.quantity || 1)
            ).toFixed(2)}
          </p>
        </div>

        {/* Remove */}
        <button
          onClick={handleRemove}
          className="mt-2 sm:mt-3 text-red-500 hover:text-red-700 flex items-center text-xs sm:text-sm transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
