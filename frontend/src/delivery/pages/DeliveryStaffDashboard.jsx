import React, { useState, useEffect } from "react";

// Layout
import DeliverySidebar from "../components/DeliverySidebar";
import DeliveryTopbar from "../components/DeliveryTopbar";

// Pages
import DeliveryDashboard from "./DeliveryDashboard";

const DeliveryStaffDashboard = () => {
  const [activeSection, setActiveSection] = useState("deliveries");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Set initial sidebar state based on screen width
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true); // open on desktop
    } else {
      setSidebarOpen(false); // closed on mobile
    }
  }, []);

  // 📌 Section rendering
  const renderContent = () => {
    switch (activeSection) {
      case "deliveries":
        return <DeliveryDashboard />;
      case "tracking":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Live Location Tracking</h2>
            <p className="text-gray-600">
              Click on a delivery to view real-time tracking
            </p>
          </div>
        );
      case "dashboard":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Dashboard</h2>
            <p className="text-gray-600">Dashboard statistics will appear here</p>
          </div>
        );
      case "orders":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Orders</h2>
            <p className="text-gray-600">Associated orders will appear here</p>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <p className="text-gray-600">Settings will appear here</p>
          </div>
        );
      default:
        return <DeliveryDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DeliverySidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <DeliveryTopbar activeSection={activeSection} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DeliveryStaffDashboard;
