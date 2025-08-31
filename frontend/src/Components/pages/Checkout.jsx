import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../contexts/CartContext";

// Helper function to get item identifier
const getItemId = (item) => item.id || item._id;

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    specialInstructions: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        customer: customerInfo,
        items: cart || [],
        total: getCartTotal(),
        paymentMethod,
        status: "pending",
      };

      const response = await api.post("/api/orders", orderData);

      if (response.data.success) {
        clearCart();
        navigate("/order-success", {
          state: {
            orderId: response.data.orderId,
            orderTotal: getCartTotal().toFixed(2),
          },
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      navigate("/order-failed", {
        state: {
          error: error.response?.data?.message || "Failed to place order",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if cart is undefined or empty
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="mb-4">Add some items to your cart before checkout.</p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {cart.map((item) => {
              const itemId = getItemId(item);
              return (
                <div
                  key={itemId}
                  className="flex justify-between items-center mb-4 pb-4 border-b"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold">
                    ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </span>
                </div>
              );
            })}

            <div className="flex justify-between mt-4 pt-4 border-t">
              <span className="font-bold text-lg">Total:</span>
              <span className="font-bold text-lg">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Customer Information and Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  rows="3"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  value={customerInfo.specialInstructions}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  rows="2"
                />
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-sm text-gray-600">
                        Pay when you receive your order
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === "wallet"}
                      onChange={() => setPaymentMethod("wallet")}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium">Wallet Payment</span>
                      <p className="text-sm text-gray-600">
                        Pay using your wallet balance
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={() => setPaymentMethod("bank")}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium">Bank Transfer</span>
                      <p className="text-sm text-gray-600">
                        Pay via bank transfer
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
