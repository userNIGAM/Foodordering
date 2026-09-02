/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../services/api.js";
import { useCart } from "../../../contexts/CartContext.jsx";
import { showToastSequence } from "../../../utils/toastQueue";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        console.log("Current payment URL:", window.location.href);

        // eSewa returns a base64-encoded 'data' parameter
        const encodedData = searchParams.get("data");
        if (!encodedData) {
          throw new Error("Missing data parameter from eSewa");
        }

        // Decode base64 and parse JSON
        const decodedData = JSON.parse(atob(encodedData));
        console.log("Decoded eSewa data:", decodedData);

        // Extract fields from decoded data
        const {
          transaction_uuid,
          status,
          transaction_code: refId,
        } = decodedData;

        if (status !== "COMPLETE") {
          throw new Error(`Payment status: ${status}`);
        }

        if (!transaction_uuid) {
          throw new Error("Missing transaction_uuid in eSewa response");
        }

        // ✅ Correct endpoint – match backend mount
        const response = await api.post("/api/payment/esewa/verify", {
          transaction_uuid,
          referenceId: refId || null, // send refId if available
        });

        console.log("Verification response:", response.data);

        if (response.data.success) {
          setMessage("Payment successful! Redirecting...");
          clearCart();
          showToastSequence([{ type: "success", message: "Payment verified successfully" }]);
          navigate("/order-success", {
            replace: true,
            state: {
              orderId: response.data.orderId,
              orderTotal: response.data.amount,
            },
          });
        } else {
          setMessage("Verification failed.");
          showToastSequence([{ type: "error", message: "Payment verification failed" }]);
          navigate("/order-failed", {
            replace: true,
            state: { error: "Payment verification failed" },
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setMessage("An error occurred. Redirecting...");
        showToastSequence([{ type: "error", message: error.response?.data?.message || error.message || "Payment verification failed" }]);
        navigate("/order-failed", {
          replace: true,
          state: {
            error:
              error.response?.data?.message ||
              error.message ||
              "Payment verification failed",
          },
        });
      }
    };

    verifyPayment();
  }, [navigate, searchParams, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Processing Payment</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
