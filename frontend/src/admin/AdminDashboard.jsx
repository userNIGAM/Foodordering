import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

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
import ChefDashboard from "./pages/kitchen/ChefDashboard";
import KitchenManagement from "./pages/kitchen/KitchenManagement";
import KitchenDisplaySystem from "./pages/kitchen/KitchenDisplaySystem";
import DeliveryDashboard from "../delivery/dashboard/DeliveryDashboard";
import CreateStaff from "./pages/createstaff/CreateStaff";

axios.defaults.withCredentials = true;

const AdminDashboard = () => {
  const { user, loading: authLoading, isAdmin } = useContext(AuthContext);

  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recentOrders: [],
    salesData: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  /**
   * Sidebar initial state
   */
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, []);

  /**
   * Fetch dashboard data
   */
  useEffect(() => {
    // Don't request dashboard data
    // until authentication has been checked.
    if (authLoading || !user || !isAdmin) {
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(
          "http://localhost:5000/api/admin/dashboard",
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error(
          "Error fetching dashboard data:",
          error?.response?.data || error?.message,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [authLoading, user, isAdmin]);

  /**
   * Socket connection
   *
   * Change this port if your Socket.IO backend
   * is running somewhere else.
   */
  useEffect(() => {
    if (authLoading || !user || !isAdmin) {
      return;
    }

    const socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    socket.on("orderUpdate", (updatedOrder) => {
      setDashboardData((prev) => ({
        ...prev,

        recentOrders: prev.recentOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
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
                    10,
                  ) + 1
                ).toLocaleString(),
              }
            : stat,
        ),

        recentOrders: [newOrder, ...prev.recentOrders.slice(0, 9)],
      }));
    });

    return () => {
      socket.off("orderUpdate");
      socket.off("newOrder");
      socket.disconnect();
    };
  }, [authLoading, user, isAdmin]);

  /**
   * Authentication loading
   */
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />

          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  /**
   * User is not logged in
   */
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  /**
   * User is logged in but isn't an admin
   */
  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  /**
   * Dashboard loading
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />

          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  /**
   * Dashboard sections
   */
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

      case "chef-dashboard":
        return <ChefDashboard />;

      case "kitchen-management":
        return <KitchenManagement />;

      case "kitchen-display":
        return <KitchenDisplaySystem />;

      case "delivery-dashboard":
        return <DeliveryDashboard />;

      case "create-staff":
        return <CreateStaff />;

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
