import React, { useState, useMemo } from "react";
import { Download } from "lucide-react";
import LowStockAlerts from "./LowStockAlerts";

const RecentOrders = ({ orders, lowStockAlerts }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("time");
  const itemsPerPage = 5;

  const filteredOrders = useMemo(() => {
    return orders
      .filter(
        (order) =>
          order.customer.toLowerCase().includes(search.toLowerCase()) ||
          order.id.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortKey === "amount")
          return parseFloat(b.amount) - parseFloat(a.amount);
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
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <div className="flex items-center space-x-2">
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

      <div className="space-y-4">
        {paginatedOrders.map((order, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-600">{order.customer}</p>
            </div>
            <div className="text-right mr-4">
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
      <div className="flex justify-end mt-4 space-x-2">
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
  );
};

export default RecentOrders;
