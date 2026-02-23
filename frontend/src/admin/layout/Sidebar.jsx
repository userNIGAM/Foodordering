import React, { useEffect } from "react";
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
import Logout from "../../logout/Logout";

/**
 * Sidebar: shows a static desktop sidebar (lg+) and an animated mobile sidebar (below lg).
 * - On mobile, overlay + slide-in motion.
 * - Clicking a nav item will close mobile sidebar but keep desktop sidebar open.
 */
const Sidebar = ({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "inventory", label: "Inventory", icon: Warehouse },
    { id: "promotions", label: "Promotions", icon: Tag },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "kitchen-display", label: "Kitchen Display", icon: BarChart3 },
    { id: "kitchen-management", label: "Kitchen Mgmt", icon: Settings },
    { id: "chef-dashboard", label: "Chef Dashboard", icon: Users },
    { id: "delivery-dashboard", label: "Delivery Dashboard", icon: ShoppingCart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Motion variants for slide-in/out
  const sidebarVariants = {
    hidden: {
      x: "-100%",
      opacity: 0,
      transition: { type: "tween", duration: 0.28 },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "tween", duration: 0.28 },
    },
  };

  // Close mobile sidebar on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSidebarOpen]);

  // Helper to decide if we should close the sidebar after clicking (mobile only)
  const handleNavClick = (id) => {
    setActiveSection(id);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
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

      {/* Mobile animated sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl lg:hidden"
            aria-label="Mobile sidebar"
          >
            <div className="flex items-center justify-between px-4 py-5 bg-gradient-to-r from-blue-600 to-sky-600">
              <div className="text-white font-semibold text-lg">
                Admin Panel
              </div>
              <button
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                className="text-white p-1 rounded-md hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-3">
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  placeholder="Search menu..."
                  className="pl-10 pr-3 py-2 w-full border rounded-lg text-sm"
                />
              </div>

              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center w-full px-3 py-3 rounded-lg text-left transition ${
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
              <button className="flex items-center w-full px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop static sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-white border-r border-gray-100">
        <div className="flex items-center h-16 px-6 bg-gradient-to-r from-blue-600 to-sky-600">
          <div className="text-white font-semibold text-lg">Admin Panel</div>
        </div>

        <div className="px-4 py-3">
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              placeholder="Search..."
              className="pl-10 pr-3 py-2 w-full border rounded-lg text-sm"
            />
          </div>

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center w-full px-3 py-3 rounded-lg text-left transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100">
          <div className="flex items-center w-full px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            <Logout />
            {/* <span className="font-medium">Logout</span> */}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
