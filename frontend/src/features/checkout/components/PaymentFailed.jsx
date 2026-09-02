import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Payment Failed
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment could not be completed. Please try again.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/checkout")}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;