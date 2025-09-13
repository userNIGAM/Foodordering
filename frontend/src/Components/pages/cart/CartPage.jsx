import React from "react";
import { useNavigate } from "react-router-dom";
import CartHeader from "./CartHeader";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartEmpty from "./CartEmpty";
import { X } from "lucide-react";

const CartModal = ({
  isOpen,
  onClose,
  cartItems,
  increaseQty,
  decreaseQty,
  removeItem,
}) => {
  const subtotal = cartItems
    .reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);
  const shipping = 0;
  const tax = (parseFloat(subtotal) * 0.08).toFixed(2);
  const total = (parseFloat(subtotal) + shipping + parseFloat(tax)).toFixed(2);

  const navigate = useNavigate();
  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close cart"
        >
          <X className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>
        {/* Header (mobile only) */}
        <div className="lg:hidden">
          <CartHeader onClose={onClose} itemCount={cartItems.length} />
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

        {/* Summary (desktop + mobile bottom) */}
        {cartItems.length > 0 && (
          <CartSummary
            subtotal={subtotal}
            tax={tax}
            total={total}
            itemCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            onCheckout={handleCheckout}
          />
        )}
      </div>
    </div>
  );
};

export default CartModal;
