import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User, ClipboardList } from "lucide-react";
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
        items: cart.map((item) => ({
          menuItemId: typeof item._id === "string" ? item._id : null, // only keep valid IDs
          name: item.name,
          price: Number(item.price), // force number
          quantity: Number(item.quantity), // force number
        })),
        total: Number(getCartTotal().toFixed(2)),
        paymentMethod,
        status: "pending",
      };
      console.log("Submitting orderData:", orderData);
      console.log("Submitting orderData:", JSON.stringify(orderData, null, 2));
      const response = await api.post("/api/orders", orderData);

      if (response.data.success) {
        // clearCart();
        setTimeout(() => {
          clearCart();
          navigate("/order-success", {
            state: {
              orderId: response.data.orderId,
              orderTotal: getCartTotal().toFixed(2),
            },
          });
        }, 5000);
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

  // If cart is empty
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-10 rounded-2xl shadow-lg"
        >
          <ClipboardList className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="mb-6 text-gray-600">
            Add some items to your cart before checkout.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition"
          >
            Back to Menu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen my-20 bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Customer & Payment Info */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name *
              </label>
              <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 ring-green-500 transition">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email *
              </label>
              <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 ring-green-500 transition">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone *
              </label>
              <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 ring-green-500 transition">
                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Delivery Address *
              </label>
              <div className="flex items-start border rounded-lg p-3 focus-within:ring-2 ring-green-500 transition">
                <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  className="w-full outline-none resize-none"
                  rows="3"
                  required
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={customerInfo.specialInstructions}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-3 resize-none focus:ring-2 ring-green-500 transition"
                rows="2"
              />
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Payment Method
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: "cod", label: "Cash on Delivery" },
                  { value: "wallet", label: "Wallet" },
                  { value: "bank", label: "Bank Transfer" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`border rounded-lg p-4 flex items-center justify-center cursor-pointer transition hover:shadow-md ${
                      paymentMethod === method.value
                        ? "border-green-500 ring-2 ring-green-300"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="hidden"
                    />
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Place Order Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </motion.button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Order Summary
          </h2>
          <div className="space-y-4">
            {cart.map((item) => {
              const itemId = getItemId(item);
              return (
                <div
                  key={itemId}
                  className="flex justify-between items-center pb-4 border-b"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-md mr-3"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-700">
                    ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-lg text-green-600">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
