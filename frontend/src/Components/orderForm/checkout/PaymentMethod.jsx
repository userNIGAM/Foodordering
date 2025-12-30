import React from "react";

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => (
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
);

export default PaymentMethod;
