import React from "react";
import { useLocation, Link } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, orderTotal } = location.state || {};

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="mb-4">We couldn't find your order information.</p>
          <Link to="/menu" className="text-blue-600 hover:underline">
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Order Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We've sent a confirmation email with your
          order details.
        </p>

        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">Order Information</h2>
          <p className="text-gray-700">
            <strong>Order ID:</strong> {orderId}
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Total Amount:</strong> ${orderTotal}
          </p>
          <p className="text-gray-700 mt-2">
            You will receive an email when your order is on its way.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/menu"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
