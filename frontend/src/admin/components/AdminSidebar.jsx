import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Warehouse,
  Tag,
  X,
  Search,
} from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";

const Sidebar = ({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { logout } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Add Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "inventory", label: "Inventory", icon: Warehouse },
    { id: "promotions", label: "Promotions", icon: Tag },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    {
      id: "kitchen-display",
      label: "Kitchen Display",
      icon: BarChart3,
    },
    {
      id: "kitchen-management",
      label: "Kitchen Mgmt",
      icon: Settings,
    },
    {
      id: "chef-dashboard",
      label: "Chef Dashboard",
      icon: Users,
    },
    {
      id: "delivery-dashboard",
      label: "Delivery Dashboard",
      icon: ShoppingCart,
    },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "create-staff", label: "Create Staff", icon: Users },
  ];

  const sidebarVariants = {
    hidden: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "tween",
        duration: 0.28,
      },
    },

    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.28,
      },
    },
  };

  // Close sidebar with Escape
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [setSidebarOpen]);

  // Navigation click
  const handleNavClick = (id) => {
    setActiveSection(id);

    // Close only on mobile
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      // Close mobile sidebar
      setSidebarOpen(false);

      // Clear authentication state
      await logout();

      // Redirect to login
      window.location.href = "/auth";
    } catch (error) {
      console.error("Logout failed:", error);

      // Redirect even if logout request fails
      window.location.href = "/auth";
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderNavigation = () => {
    return navigationItems.map((item) => {
      const Icon = item.icon;
      const active = activeSection === item.id;

      return (
        <button
          key={item.id}
          type="button"
          onClick={() => handleNavClick(item.id)}
          className={`flex items-center w-full px-3 py-3 rounded-lg text-left transition-colors ${
            active
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Icon className="w-5 h-5 mr-3 shrink-0" />

          <span className="font-medium">{item.label}</span>
        </button>
      );
    });
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl lg:hidden flex flex-col"
            aria-label="Mobile sidebar"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-5 bg-gradient-to-r from-blue-600 to-sky-600">
              <div className="text-white font-semibold text-lg">
                Admin Panel
              </div>

              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                className="text-white p-1 rounded-md hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation area */}
            <div className="px-4 py-3 flex-1 overflow-y-auto">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />

                <input
                  type="text"
                  placeholder="Search menu..."
                  className="pl-10 pr-3 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              {/* Navigation */}
              <nav className="space-y-1">{renderNavigation()}</nav>
            </div>

            {/* Mobile Logout */}
            <div className="p-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center w-full px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-5 h-5 mr-3" />

                <span className="font-medium">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-white border-r border-gray-100">
        {/* Header */}
        <div className="flex items-center h-16 px-6 bg-gradient-to-r from-blue-600 to-sky-600">
          <div className="text-white font-semibold text-lg">Admin Panel</div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-3 flex-1 overflow-y-auto">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />

            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-3 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* Navigation */}
          <nav className="space-y-1">{renderNavigation()}</nav>
        </div>

        {/* Desktop Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center w-full px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-5 h-5 mr-3" />

            <span className="font-medium">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
