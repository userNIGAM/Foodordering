import React from "react";

const OrdersFilters = ({ filter, setFilter, searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search orders..."
          className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="preparing">Preparing</option>
        <option value="out for delivery">Out for Delivery</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );
};

export default OrdersFilters;
