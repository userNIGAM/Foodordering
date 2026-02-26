import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// Layout
import KitchenSidebar from "./layout/KitchenSidebar";
import KitchenTopbar from "./layout/KitchenTopbar";

// Pages
import KitchenOrders from "./pages/KitchenOrders";
import ChefDashboard from "../admin/pages/kitchen/ChefDashboard";
import KitchenDisplaySystem from "../admin/pages/kitchen/KitchenDisplaySystem";

// Axios global config
axios.defaults.withCredentials = true;

const KitchenStaffDashboard = () => {
  const [activeSection, setActiveSection] = useState("orders");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kitchenData, setKitchenData] = useState({
    assignments: [],
    activeOrders: [],
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Set initial sidebar state based on screen width
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true); // open on desktop
    } else {
      setSidebarOpen(false); // closed on mobile
    }
  }, []);

  // ✅ Fetch kitchen data + setup socket listeners
  useEffect(() => {
    const fetchKitchenData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/chef/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setKitchenData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching kitchen data:", error);
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchKitchenData();

    const socket = io("http://localhost:5000", { withCredentials: true });

    socket.on("orderUpdate", (updatedOrder) => {
      setKitchenData((prev) => ({
        ...prev,
        activeOrders: prev.activeOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        ),
      }));
    });

    socket.on("newOrderForChef", (newOrder) => {
      setKitchenData((prev) => ({
        ...prev,
        activeOrders: [newOrder, ...prev.activeOrders],
      }));
    });

    return () => {
      socket.off("orderUpdate");
      socket.off("newOrderForChef");
      socket.disconnect();
    };
  }, []);

  // ❌ Not logged in
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You need to be logged in as a chef to access this page.
          </p>
          <button
            onClick={() => (window.location.href = "/auth")}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ⏳ Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading kitchen data...</p>
        </div>
      </div>
    );
  }

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
