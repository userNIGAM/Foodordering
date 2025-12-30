/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../../services/api";
import { useCart } from "../../../contexts/CartContext";

import EmptyCartMessage from "./EmptyCartMessage";
import CustomerForm from "./CustomerForm";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";

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
          menuItemId: typeof item._id === "string" ? item._id : null,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
        total: Number(getCartTotal().toFixed(2)),
        paymentMethod,
        status: "pending",
      };

      const response = await api.post("/api/orders", orderData);

      if (response.data.success) {
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

  if (!cart || cart.length === 0) return <EmptyCartMessage />;

  return (
    <div className="min-h-screen my-20 bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <CustomerForm
              customerInfo={customerInfo}
              onChange={handleInputChange}
            />

            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

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

        <OrderSummary />
      </motion.div>
    </div>
  );
};

export default Checkout;
