/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyCartMessage = () => {
  const navigate = useNavigate();

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
};

export default EmptyCartMessage;
