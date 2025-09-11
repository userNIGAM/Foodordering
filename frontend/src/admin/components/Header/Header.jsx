import React from "react";
import { Menu, Plus, ChevronDown } from "lucide-react";

const Header = ({ activeSection, setSidebarOpen }) => {
  const getPageTitle = () => {
    const titles = {
      dashboard: "Dashboard Overview",
      orders: "Orders Management",
      products: "Products Management",
      customers: "Customer Management",
      analytics: "Analytics Dashboard",
    };
    return titles[activeSection] || "Dashboard";
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center">
        <button
          className="p-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="ml-4 text-2xl font-bold text-gray-900">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </button>
        <div className="relative">
          <div className="flex items-center p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-700">
              Admin User
            </span>
            <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
