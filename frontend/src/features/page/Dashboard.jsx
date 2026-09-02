import React, { useState } from "react";
import {
  User,
  ShieldCheck,
  Bell,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import api from "../../services/api";

import ProfileSection from "../profile/Profile/ProfileSection/";
import SecuritySection from "../profile/Security/SecuritySection";
import NotificationsSection from "../profile/Notification/NotificationsSection";
import BillingSection from "../profile/Billing/BillingSection";
import SettingsSection from "../profile/Setting/SettingsSection";
import LogoutSection from "../profile/Logout/LogoutSection";

import Sidebar from "../profile/Sidebar/Sidebar";
import MobileSidebar from "../profile/Mobile/MobileSidebar";
import HeaderSection from "../profile/Header/HeaderSection";

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
        return <ProfileSection user={user} />;
      case "security":
        return <SecuritySection />;
      case "notifications":
        return <NotificationsSection />;
      case "billing":
        return <BillingSection />;
      case "settings":
        return <SettingsSection />;
      case "logout":
        return <LogoutSection onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 w-full">
      <div className="w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
          >
            <User className="w-6 h-6 text-indigo-600" />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <Sidebar
              user={user}
              navigationItems={navigationItems}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />

            {/* Main content */}
            <div className="flex-1 p-6 md:p-8">
              <HeaderSection activeSection={activeSection} />
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        user={user}
        navigationItems={navigationItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </div>
  );
};

export default Dashboard;
