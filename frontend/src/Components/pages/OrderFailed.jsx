import React from "react";
import { useLocation, Link } from "react-router-dom";

const OrderFailed = () => {
  const location = useLocation();
  const { error } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Failed</h1>
        <p className="text-gray-600 mb-6">
          {error ||
            "There was an issue processing your order. Please try again."}
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/menu"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back to Menu
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;
