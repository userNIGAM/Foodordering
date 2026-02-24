import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// Layout
import DeliverySidebar from "./layout/DeliverySidebar";
import DeliveryTopbar from "./layout/DeliveryTopbar";

// Pages
import DeliveryDashboard from "../admin/pages/kitchen/DeliveryDashboard";

// Axios global config
axios.defaults.withCredentials = true;

const DeliveryStaffDashboard = () => {
  const [activeSection, setActiveSection] = useState("deliveries");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    assignments: [],
    activeDeliveries: [],
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

  // ✅ Fetch delivery data + setup socket listeners
  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/delivery/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setDeliveryData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching delivery data:", error);
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryData();

    const socket = io("http://localhost:5000", { withCredentials: true });

    socket.on("deliveryUpdate", (updatedDelivery) => {
      setDeliveryData((prev) => ({
        ...prev,
        activeDeliveries: prev.activeDeliveries.map((delivery) =>
          delivery._id === updatedDelivery._id ? updatedDelivery : delivery
        ),
      }));
    });

    socket.on("newDeliveryAssignment", (newDelivery) => {
      setDeliveryData((prev) => ({
        ...prev,
        activeDeliveries: [newDelivery, ...prev.activeDeliveries],
      }));
    });

    return () => {
      socket.off("deliveryUpdate");
      socket.off("newDeliveryAssignment");
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
            You need to be logged in as a delivery person to access this page.
          </p>
          <button
            onClick={() => (window.location.href = "/auth")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading delivery data...</p>
        </div>
      </div>
    );
  }

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
