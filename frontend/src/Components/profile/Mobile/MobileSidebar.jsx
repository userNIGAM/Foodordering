import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";

export default function MobileSidebar({
  isOpen,
  setIsOpen,
  user,
  navigationItems,
  activeSection,
  setActiveSection,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed top-0 left-0 h-full w-64 bg-slate-800 text-white p-6 z-50 md:hidden"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center mb-8 mt-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                {/* <navigationItems[0].icon className="w-6 h-6" /> placeholder */}
              </div>
              <div>
                <h2 className="font-semibold">{user?.name}</h2>
                <p className="text-slate-300 text-sm">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) item.action();
                    else setActiveSection(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                    activeSection === item.id
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                  {activeSection === item.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
