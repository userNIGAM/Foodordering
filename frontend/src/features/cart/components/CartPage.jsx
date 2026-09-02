import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import CartHeader from "./CartHeader";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartEmpty from "./CartEmpty";

const Cart = ({
  isOpen,
  onClose,
  cartItems = [],
  increaseQty,
  decreaseQty,
  removeItem,
}) => {
  const navigate = useNavigate();

  // Calculate subtotal
  const subtotal = cartItems
    .reduce(
      (acc, item) =>
        acc + Number.parseFloat(item.price || 0) * Number(item.quantity || 1),
      0,
    )
    .toFixed(2);

  // 8% tax
  const tax = (Number.parseFloat(subtotal) * 0.08).toFixed(2);

  // Final total
  const total = (Number.parseFloat(subtotal) + Number.parseFloat(tax)).toFixed(
    2,
  );

  // Total quantity of all products
  const itemCount = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity || 1),
    0,
  );

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  // Don't render when cart is closed
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4"
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
          aria-label="Close cart"
        >
          <X className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>

        {/* Mobile Header */}
        <div className="lg:hidden">
          <CartHeader onClose={onClose} itemCount={itemCount} />
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 lg:py-6 lg:max-h-[calc(90vh-2rem)]">
          {cartItems.length === 0 ? (
            <CartEmpty />
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {cartItems.map((item) => (
                <CartItem
                  key={item._id || item.id}
                  item={item}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                  removeItem={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <CartSummary
            subtotal={subtotal}
            tax={tax}
            total={total}
            itemCount={itemCount}
            onCheckout={handleCheckout}
          />
        )}
      </div>
    </div>
  );
};

export default Cart;
