import { useState } from "react";
import BillingHeader from "./BillingHeader";
import OrdersTable from "./OrdersTable";
import BillingSummary from "./BillingSummary";
import BillingSupport from "./BillingSupport";

export default function BillingSection() {
  const [orders] = useState([
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

  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);

  const handleDownloadPDF = () => {
    console.log("TODO: Generate and download PDF");
  };

  const handlePayment = () => {
    console.log("TODO: Integrate payment gateway");
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Billing History
      </h2>

      <BillingHeader
        ordersCount={orders.length}
        onDownloadPDF={handleDownloadPDF}
      />

      <OrdersTable
        orders={orders}
        formatDate={formatDate}
        totalAmount={totalAmount}
      />

      <BillingSummary totalAmount={totalAmount} onPayment={handlePayment} />

      <BillingSupport />
    </div>
  );
}
