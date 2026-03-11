import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../services/api.js";
import { useCart } from "../../../contexts/CartContext.jsx";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get("oid");

        if (!orderId) {
          throw new Error("Missing order ID");
        }

        const response = await api.post("/api/payment/esewa/verify", {
          orderId,
        });

        if (response.data.success) {
          clearCart();

          navigate("/order-success", {
            state: {
              orderId: orderId,
              orderTotal: response.data.amount,
            },
          });
        } else {
          navigate("/order-failed", {
            state: {
              error: "Payment verification failed",
            },
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);

        navigate("/order-failed", {
          state: {
            error: "Payment verification failed",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [navigate, searchParams, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Processing Payment</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;