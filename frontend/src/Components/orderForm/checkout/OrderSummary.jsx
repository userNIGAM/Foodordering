import React from "react";
import { useCart } from "../../../contexts/CartContext";

const getItemId = (item) => item.id || item._id;

const OrderSummary = () => {
  const { cart, getCartTotal } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 h-fit sticky top-24">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Order Summary
      </h2>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={getItemId(item)}
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
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>

            <span className="font-bold text-gray-700">
              Rs.{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t">
        <span className="font-bold text-lg">Total:</span>
        <span className="font-bold text-lg text-green-600">
          Rs.{getCartTotal().toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
