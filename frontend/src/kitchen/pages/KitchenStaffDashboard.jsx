import React, { useState, useEffect } from "react";

// Layout
import KitchenSidebar from "../components/KitchenSidebar";
import KitchenTopbar from "../components/KitchenTopbar";

// Pages
import KitchenOrders from "./KitchenOrders";
import ChefDashboard from "../../admin/kitchen/ChefDashboard/ChefDashboard";
import KitchenDisplaySystem from "../../admin/kitchen/KitchenDisplaySystem";

const KitchenStaffDashboard = () => {
  const [activeSection, setActiveSection] = useState("orders");
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
      case "orders":
        return <KitchenOrders />;
      case "kitchen-display":
        return <KitchenDisplaySystem />;
      case "assignments":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">My Assignments</h2>
            <p className="text-gray-600">Assignments will appear here</p>
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
        return <KitchenOrders />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <KitchenSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <KitchenTopbar activeSection={activeSection} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default KitchenStaffDashboard;
