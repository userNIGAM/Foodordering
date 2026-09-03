import React, { useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Plus, ChevronDown, Bell, Search } from "lucide-react";
import { AuthContext } from "../../features/Auth/AuthContext";

const Topbar = ({ activeSection, setSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user, logout } = useContext(AuthContext);

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
      "kitchen-display": "Kitchen Display",
      "kitchen-management": "Kitchen Management",
      "chef-dashboard": "Chef Dashboard",
      "delivery-dashboard": "Delivery Dashboard",
      "create-staff": "Create Staff",
    };

    return titles[activeSection] || "Dashboard";
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      // Close profile dropdown
      setIsProfileOpen(false);

      // Clear authentication state
      await logout();

      // Redirect to login page
      window.location.href = "/auth";
    } catch (error) {
      console.error("Logout failed:", error);

      // Even if API logout fails,
      // redirect user to authentication page.
      window.location.href = "/auth";
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ==========================================================
  // USER INITIALS
  // ==========================================================

  const getInitials = () => {
    if (!user) {
      return "AD";
    }

    if (user.name) {
      return user.name
        .split(" ")
        .filter(Boolean)
        .map((name) => name.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "AD";
  };

  // ==========================================================
  // DISPLAY NAME
  // ==========================================================

  const getDisplayName = () => {
    if (user?.name) {
      return user.name;
    }

    if (user?.email) {
      return user.email.split("@")[0];
    }

    return "Admin";
  };

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-20 bg-white border-b border-gray-200 py-3 sm:py-4"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* ==================================================
              LEFT SIDE
          =================================================== */}

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Hamburger */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle sidebar"
              className="p-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            {/* Page title */}
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900">
                {getPageTitle()}
              </h1>

              <p className="text-xs sm:text-sm text-gray-500">
                Welcome back — here's your admin overview.
              </p>
            </div>
          </div>

          {/* ==================================================
              RIGHT SIDE
          =================================================== */}

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search */}
            <div className="relative hidden md:flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3" />

              <input
                type="text"
                aria-label="Search"
                placeholder="Search..."
                className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
              />
            </div>

            {/* Notifications */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              aria-label="Notifications"
              className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Bell className="w-5 h-5" />

              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-red-500 rounded-full">
                3
              </span>
            </motion.button>

            {/* New Order */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              className="hidden sm:inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </motion.button>

            {/* ==================================================
                PROFILE
            =================================================== */}

            <div className="relative">
              <motion.button
                type="button"
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
                whileTap={{ scale: 0.97 }}
                className="flex items-center space-x-2 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setIsProfileOpen((previous) => !previous)}
              >
                {/* Avatar */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {getInitials()}
                </div>

                {/* Name */}
                <span className="text-xs sm:text-sm font-medium text-gray-700 max-w-24 sm:max-w-none truncate">
                  {getDisplayName()}
                </span>

                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              {/* ==================================================
                  PROFILE DROPDOWN
              =================================================== */}

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                    className="absolute right-0 mt-2 w-40 sm:w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50"
                    role="menu"
                  >
                    {/* Profile */}
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setIsProfileOpen(false);
                      }}
                    >
                      Profile
                    </button>

                    {/* Settings */}
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setIsProfileOpen(false);
                      }}
                    >
                      Settings
                    </button>

                    <div className="border-t border-gray-100" />

                    {/* Logout */}
                    <button
                      type="button"
                      disabled={isLoggingOut}
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
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

export default Topbar;
