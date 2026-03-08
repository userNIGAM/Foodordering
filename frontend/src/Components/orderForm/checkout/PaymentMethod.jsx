import React from "react";

const methods = [
  {
    value: "cod",
    label: "Cash on Delivery",
    icon: "/icons/cash.png",
  },
  {
    value: "esewa",
    label: "eSewa",
    icon: "/icons/esewa.png",
  },
  {
    value: "khalti",
    label: "Khalti",
    icon: "/icons/khalti.png",
  },
  {
    value: "ime",
    label: "IME Pay",
    icon: "/icons/imepay.png",
  },
];

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        Payment Method
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {methods.map((method) => (
          <label
            key={method.value}
            className={`flex flex-col items-center justify-center border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              paymentMethod === method.value
                ? "border-green-500 ring-2 ring-green-300 bg-green-50"
                : "border-gray-200 bg-white"
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

            <img
              src={method.icon}
              alt={method.label}
              className="h-10 mb-2 object-contain"
            />

            <span className="text-sm font-medium text-gray-700">
              {method.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;