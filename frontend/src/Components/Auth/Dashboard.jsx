import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  User,
  Mail,
  ShieldCheck,
  Lock,
  Bell,
  CreditCard,
  Settings,
  ChevronRight,
  X,
} from "lucide-react";
import api from "../../services/api";

const Dashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("api/auth/logout");
      onLogout();
    } catch (err) {
      console.error("Logout error:", err);
      onLogout();
    }
  };

  const navigationItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut, action: handleLogout },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.name?.split(" ")[0] || ""}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.name?.split(" ")[1] || ""}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Bio
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
              Save Changes
            </button>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Security Settings
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  Change Password
                </h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  Add Additional Email
                </h3>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter additional email"
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="bg-slate-800 text-white px-4 py-3 rounded-xl font-medium hover:bg-slate-900 transition-colors">
                    Add Email
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-slate-600">2FA is currently disabled</p>
                  <button className="bg-slate-800 text-white px-4 py-2 rounded-xl font-medium hover:bg-slate-900 transition-colors text-sm">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "logout":
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Ready to leave?
            </h2>
            <p className="text-slate-600 mb-6">
              You can always log back in anytime.
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Confirm Logout
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h2>
            <p className="text-slate-600">This section is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 w-full">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
          >
            <User className="w-6 h-6 text-indigo-600" />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar navigation */}
            <div className="md:w-64 bg-slate-800 text-white p-6">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6" />
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
                      if (item.action) {
                        item.action();
                      } else {
                        setActiveSection(item.id);
                      }
                      setIsMobileMenuOpen(false);
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
            </div>

            {/* Main content */}
            <div className="flex-1 p-6 md:p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 capitalize">
                  {activeSection === "logout" ? "Logout" : activeSection}
                </h1>
                <p className="text-slate-600">
                  {activeSection === "profile"
                    ? "Manage your personal information"
                    : activeSection === "security"
                    ? "Secure your account with password and 2FA"
                    : activeSection === "logout"
                    ? "Sign out of your account"
                    : "Manage your preferences"}
                </p>
              </div>

              {renderContent()}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-slate-800 text-white p-6 z-50 md:hidden"
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center mb-8 mt-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6" />
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
                      if (item.action) {
                        item.action();
                      } else {
                        setActiveSection(item.id);
                      }
                      setIsMobileMenuOpen(false);
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
    </div>
  );
};

export default Dashboard;
