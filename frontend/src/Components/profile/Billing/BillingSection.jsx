import React, { useState } from "react";

export default function BillingSection() {
  // Dummy data for the last 30 days
  const [orders, setOrders] = useState([
    {
      id: 1,
      date: "2023-10-15",
      time: "18:30",
      items: ["Chicken Pizza", "Coke"],
      amount: 18.5,
    },
    {
      id: 2,
      date: "2023-10-12",
      time: "12:15",
      items: ["Beef Burger", "Fries", "Milkshake"],
      amount: 14.25,
    },
    {
      id: 3,
      date: "2023-10-08",
      time: "19:45",
      items: ["Vegetable Rice Bowl", "Spring Rolls"],
      amount: 12.75,
    },
    {
      id: 4,
      date: "2023-10-05",
      time: "20:00",
      items: ["Pepperoni Pizza", "Garlic Bread", "Soda"],
      amount: 22.4,
    },
    {
      id: 5,
      date: "2023-10-01",
      time: "13:30",
      items: ["Caesar Salad", "Grilled Chicken", "Iced Tea"],
      amount: 16.8,
    },
  ]);

  // Calculate total amount
  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);

  // Function to handle PDF download (placeholder)
  const handleDownloadPDF = () => {
    alert("PDF download functionality will be implemented soon!");
    // In a real implementation, this would generate and download a PDF
  };

  // Function to handle payment (placeholder)
  const handlePayment = () => {
    alert("Redirecting to payment gateway...");
    // In a real implementation, this would integrate with a payment processor
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Billing History
      </h2>

      {/* Date filter (placeholder) */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-slate-600">
          Last 30 days •{" "}
          <span className="font-medium">{orders.length} orders</span>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors">
            Filter
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Orders table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date & Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Items
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(order.date)}
                  </div>
                  <div className="text-sm text-gray-500">{order.time}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {item}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  ${order.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td
                colSpan="2"
                className="px-6 py-4 text-sm font-semibold text-right text-gray-700"
              >
                Total Amount:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                ${totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment section */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Total Amount Due
            </h3>
            <p className="text-sm text-slate-600">
              Payment for last 30 days orders
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-bold text-blue-700">
              ${totalAmount.toFixed(2)}
            </h3>
            <button
              onClick={handlePayment}
              className="mt-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>

      {/* Additional information */}
      <div className="mt-6 text-center text-sm text-slate-500">
        <p>
          Need help with your bill? Contact our support team at
          support@fooddelivery.com
        </p>
      </div>
    </div>
  );
}
