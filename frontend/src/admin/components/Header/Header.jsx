import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Plus, ChevronDown, Bell, Search } from "lucide-react";

/**
 * Header: modern, accessible header with mobile hamburger.
 * - `setSidebarOpen` toggles the sidebar (hamburger on <lg).
 */
const Header = ({ activeSection, setSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getPageTitle = () => {
    const titles = {
      dashboard: "Dashboard Overview",
      orders: "Orders Management",
      products: "Products Management",
      customers: "Customer Management",
      analytics: "Analytics Dashboard",
      inventory: "Inventory Management",
      promotions: "Promotions & Discounts",
      settings: "Restaurant Settings",
    };
    return titles[activeSection] || "Dashboard";
  };

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-20 bg-white border-b border-gray-200 py-25"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {/* Hamburger (mobile only) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle sidebar"
              className="p-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)} // ✅ this opens sidebar on click
            >
              <Menu className="w-6 h-6" />
            </motion.button>

            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back — here's your admin overview.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search (shown on md+) */}
            <div className="relative hidden md:flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                aria-label="Search"
                placeholder="Search..."
                className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
              />
            </div>

            {/* Notifications */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              aria-label="Notifications"
              className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-red-500 rounded-full">
                3
              </span>
            </motion.button>

            {/* Quick action */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="hidden sm:inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </motion.button>

            {/* Profile */}
            <div className="relative">
              <motion.button
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
                whileTap={{ scale: 0.97 }}
                className="flex items-center space-x-2 px-2 py-1 rounded-lg bg-gray-50 hover:bg-gray-100"
                onClick={() => setIsProfileOpen((s) => !s)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  AD
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                    role="menu"
                  >
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                      Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                      Settings
                    </button>
                    <div className="border-t border-gray-100" />
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
