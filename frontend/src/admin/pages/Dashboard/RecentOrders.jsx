import React, { useState, useMemo } from "react";
import { Download } from "lucide-react";
import LowStockAlerts from "./LowStockAlerts";

const RecentOrders = ({ orders, lowStockAlerts }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("time");
  const itemsPerPage = 5;

  // const formatNPR = (value) => {
  //   if (!value) return "Rs. 0";

  //   // Extract numeric value - handle both string and number inputs
  //   let amount = 0;
  //   if (typeof value === "number") {
  //     amount = value;
  //   } else {
  //     // Remove "Rs." and any non-numeric characters except decimal point
  //     const numeric = String(value).replace(/[^\d.]/g, "");
  //     amount = parseFloat(numeric) || 0;
  //   }

  //   return `Rs. ${amount.toLocaleString("en-IN")}`;
  // };

  const getAmountValue = (value) => {
    if (typeof value === "number") return value;
    const numeric = String(value).replace(/[^\d.]/g, "");
    return parseFloat(numeric) || 0;
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter(
        (order) =>
          order.customer.toLowerCase().includes(search.toLowerCase()) ||
          order.id.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortKey === "amount")
          return getAmountValue(b.amount) - getAmountValue(a.amount);
        if (sortKey === "status") return a.status.localeCompare(b.status);
        return new Date(b.time) - new Date(a.time);
      });
  }, [orders, search, sortKey]);

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Recent Orders
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="px-2 py-1 text-sm border rounded-lg"
          >
            <option value="time">Latest</option>
            <option value="amount">Amount</option>
            <option value="status">Status</option>
          </select>
          <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
            <Download className="w-4 h-4 mr-1" /> Export
          </button>
        </div>
      </div>

      <LowStockAlerts alerts={lowStockAlerts} />

      {/* Orders list */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        {paginatedOrders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-600">{order.customer}</p>
            </div>
            <div className="text-left sm:text-right sm:mr-4">
              <p className="text-sm font-semibold text-gray-900">
                  {order.amount}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.time).toLocaleTimeString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : order.status === "Processing"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mt-4 gap-2">
        <div className="flex justify-center sm:justify-end gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
