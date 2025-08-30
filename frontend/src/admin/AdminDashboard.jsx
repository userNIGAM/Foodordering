// frontend/src/admin/AdminDashboard.jsx
import React, { useState } from "react";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample data
  const stats = [
    {
      title: "Total Orders",
      value: "1,426",
      change: "+12%",
      icon: "🛒",
      color: "bg-blue-500",
    },
    {
      title: "Total Revenue",
      value: "$24,841",
      change: "+8%",
      icon: "💰",
      color: "bg-green-500",
    },
    {
      title: "New Customers",
      value: "289",
      change: "+5%",
      icon: "👥",
      color: "bg-purple-500",
    },
    {
      title: "Conversion Rate",
      value: "3.8%",
      change: "+2%",
      icon: "📊",
      color: "bg-orange-500",
    },
  ];

  const salesData = [
    { day: "Mon", sales: 12 },
    { day: "Tue", sales: 19 },
    { day: "Wed", sales: 14 },
    { day: "Thu", sales: 22 },
    { day: "Fri", sales: 18 },
    { day: "Sat", sales: 25 },
    { day: "Sun", sales: 20 },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      amount: "$120",
      status: "Delivered",
      time: "2 min ago",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      amount: "$89",
      status: "Processing",
      time: "15 min ago",
    },
    {
      id: "#ORD-003",
      customer: "Bob Johnson",
      amount: "$156",
      status: "Shipped",
      time: "32 min ago",
    },
    {
      id: "#ORD-004",
      customer: "Alice Brown",
      amount: "$67",
      status: "Delivered",
      time: "45 min ago",
    },
    {
      id: "#ORD-005",
      customer: "Michael Wilson",
      amount: "$189",
      status: "Processing",
      time: "1 hour ago",
    },
  ];

  const maxSales = Math.max(...salesData.map((item) => item.sales));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-blue-900 to-purple-900 transform transition duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center h-16 px-4 bg-blue-800">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>

        <nav className="mt-8">
          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "orders", label: "Orders", icon: "🛒" },
            { id: "products", label: "Products", icon: "📦" },
            { id: "customers", label: "Customers", icon: "👥" },
            { id: "analytics", label: "Analytics", icon: "📈" },
          ].map((item) => (
            <button
              key={item.id}
              className={`flex items-center w-full px-6 py-3 mt-2 text-left transition-colors duration-200 ${
                activeSection === item.id
                  ? "bg-blue-800 text-white"
                  : "text-blue-100 hover:bg-blue-700"
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="mx-4 text-lg">{item.icon}</span>
              <span className="mx-2 font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-blue-700">
          <button className="flex items-center w-full px-6 py-3 text-blue-200 hover:text-white">
            <span className="mx-4 text-lg">⚙️</span>
            <span className="mx-2 font-medium">Settings</span>
          </button>
          <button className="flex items-center w-full px-6 py-3 text-blue-200 hover:text-white">
            <span className="mx-4 text-lg">🚪</span>
            <span className="mx-2 font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex items-center">
            <button
              className="p-1 text-gray-500 rounded-lg lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <h1 className="ml-4 text-2xl font-semibold text-gray-800">
              Dashboard Overview
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              + New Order
            </button>
            <div className="relative">
              <div className="flex items-center p-2 bg-gray-100 rounded-lg cursor-pointer">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Admin User
                </span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </h3>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      ></path>
                    </svg>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Data Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Sales Chart */}
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Weekly Sales
              </h3>
              <div className="flex items-end justify-between h-64 mt-6 space-x-2">
                {salesData.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="relative flex flex-col items-center flex-1 w-full">
                      <div
                        className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${(item.sales / maxSales) * 100}%` }}
                      >
                        <div className="absolute bottom-full mb-2 text-xs font-medium text-gray-600">
                          {item.sales}
                        </div>
                      </div>
                    </div>
                    <span className="mt-2 text-xs font-medium text-gray-500">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Orders
                </h3>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.id}
                      </p>
                      <p className="text-xs text-gray-500">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {order.amount}
                      </p>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
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
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
            {/* Quick Stats */}
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Performance Metrics
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Average Order Value",
                    value: "$112.45",
                    change: "+5.2%",
                  },
                  {
                    label: "Customer Satisfaction",
                    value: "94%",
                    change: "+3.1%",
                  },
                  { label: "Return Rate", value: "2.4%", change: "-0.8%" },
                ].map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-600">
                      {metric.label}
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-gray-800">
                        {metric.value}
                      </span>
                      <span
                        className={`ml-2 text-xs font-semibold ${
                          metric.change.startsWith("+")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  {
                    action: "New order placed",
                    time: "2 min ago",
                    user: "John Doe",
                  },
                  {
                    action: "Product updated",
                    time: "15 min ago",
                    user: "Jane Smith",
                  },
                  {
                    action: "Payment received",
                    time: "32 min ago",
                    user: "Bob Johnson",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        by {activity.user} · {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
