import React from "react";
import { X, Plus, Minus, Trash2, CreditCard, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Helper function to get item identifier
const getItemId = (item) => item.id || item._id;

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
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Modal Container - Split Layout */}
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header for mobile */}
          <div className="lg:hidden flex justify-between items-center px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {cartItems.length} item{cartItems.length !== 1 && "s"} in your
                cart
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Shopping Cart - Left Side */}
          <div className="flex-1 overflow-y-auto px-6 py-4 lg:py-6 lg:max-h-[calc(90vh-2rem)]">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm mt-2 text-gray-500">
                  Add some delicious items to get started
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const itemId = getItemId(item);
                  return (
                    <div
                      key={itemId}
                      className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">
                          {item.name}
                        </h3>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => decreaseQty(itemId)}
                              className="p-1 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-medium text-gray-900 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQty(itemId)}
                              className="p-1 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-lg">
                              $
                              {(parseFloat(item.price) * item.quantity).toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(itemId)}
                          className="mt-3 text-red-500 hover:text-red-700 transition-colors flex items-center text-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Summary - Right Side */}
          {cartItems.length > 0 && (
            <div className="lg:w-96 bg-gradient-to-b from-indigo-50 to-gray-100 px-6 py-6 lg:py-8 flex flex-col">
              <h3 className="font-bold text-gray-900 text-xl mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                    items)
                  </span>
                  <span className="font-medium">${subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span className="font-medium">${tax}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 mb-6">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-bold text-gray-900 text-xl">
                  ${total}
                </span>
              </div>

              <div className="mt-auto space-y-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </button>

                <button className="w-full border border-indigo-200 text-indigo-600 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                  <Tag className="w-5 h-5" />
                  Apply Promo Code
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-6">
                <span className="inline-flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure checkout with 256-bit SSL encryption
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal;
