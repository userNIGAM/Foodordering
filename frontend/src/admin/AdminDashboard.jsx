import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// Layout
import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";

// Pages
import DashboardContent from "./pages/Dashboard/DashboardContent";
import ProductsContent from "./pages/products/ProductsContent";
import OrdersContent from "./pages/order/OrdersContent";
import CustomersContent from "./pages/customers/CustomersContent";
import AnalyticsContent from "./pages/analytics/AnalyticsContent";
import InventoryContent from "./pages/inventory/InventoryContent";
import PromotionsContent from "./pages/promotions/PromotionsContent";
import SettingsContent from "./pages/setting/SettingsContent";

// Axios global config
axios.defaults.withCredentials = true;

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recentOrders: [],
    salesData: [],
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

  // ✅ Fetch dashboard data + setup socket listeners
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/admin/dashboard"
        );

        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    const socket = io("http://localhost:5000", { withCredentials: true });

    socket.on("orderUpdate", (updatedOrder) => {
      setDashboardData((prev) => ({
        ...prev,
        recentOrders: prev.recentOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        ),
      }));
    });

    socket.on("newOrder", (newOrder) => {
      setDashboardData((prev) => ({
        ...prev,
        stats: prev.stats.map((stat) =>
          stat.title === "Total Orders"
            ? {
                ...stat,
                value: (
                  parseInt(
                    (stat.value || "0").toString().replace(/,/g, ""),
                    10
                  ) + 1
                ).toLocaleString(),
              }
            : stat
        ),
        recentOrders: [newOrder, ...prev.recentOrders.slice(0, 9)],
      }));
    });

    return () => {
      socket.off("orderUpdate");
      socket.off("newOrder");
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
            You need to be logged in as an administrator to access this page.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // 📌 Section rendering
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContent data={dashboardData} />;
      case "products":
        return <ProductsContent />;
      case "orders":
        return <OrdersContent />;
      case "customers":
        return <CustomersContent />;
      case "inventory":
        return <InventoryContent />;
      case "promotions":
        return <PromotionsContent />;
      case "analytics":
        return <AnalyticsContent salesData={dashboardData.salesData} />;
      case "settings":
        return <SettingsContent />;
      default:
        return <DashboardContent data={dashboardData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar activeSection={activeSection} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
