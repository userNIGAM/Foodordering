import React from "react";
import { Menu, Bell, User } from "lucide-react";

const DeliveryTopbar = ({ activeSection, setSidebarOpen }) => {
  const sectionTitle = {
    deliveries: "Active Deliveries",
    tracking: "Live Location Tracking",
    dashboard: "Dashboard",
    orders: "Orders",
    settings: "Settings",
  };

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {sectionTitle[activeSection] || "Delivery Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <User className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default DeliveryTopbar;
