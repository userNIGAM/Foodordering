import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  ShoppingCart,
  Settings,
  LogOut,
  X,
  Search,
  ChefHat,
} from "lucide-react";
import Logout from "../../logout/Logout";

const KitchenSidebar = ({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigationItems = [
    { id: "orders", label: "Active Orders", icon: ShoppingCart },
    { id: "kitchen-display", label: "Kitchen Display", icon: BarChart3 },
    { id: "assignments", label: "My Assignments", icon: ChefHat },
    { id: "settings", label: "Settings", icon: Settings },
  ];

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

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSidebarOpen]);

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
            <div className="flex items-center justify-between px-4 py-5 bg-gradient-to-r from-orange-600 to-red-600">
              <div className="text-white font-semibold text-lg">
                Kitchen Staff
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
                          ? "bg-orange-50 text-orange-700"
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
        <div className="flex items-center h-16 px-6 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="text-white font-semibold text-lg">Kitchen Staff</div>
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
                      ? "bg-orange-50 text-orange-700"
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
          </div>
        </div>
      </aside>
    </>
  );
};

export default KitchenSidebar;
