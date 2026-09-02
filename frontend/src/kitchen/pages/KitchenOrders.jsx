import React, { useEffect, useState, useCallback, useContext } from "react";
import { ChefHat, User, LogOut, ChevronDown } from "lucide-react";

import useSocket from "../../hooks/useSocket";
import StatsCards from "./components/StatsCards";
import OrdersTable from "./components/OrdersTable";
import OrderDetailModal from "./components/OrderDetailModal";
import IssueModal from "./components/IssueModal";
import { AuthContext } from "../../contexts/AuthContext";

const KitchenOrders = () => {
  const { isConnected, on } = useSocket();

  const { user, logout } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const [filter, setFilter] = useState("assigned_to_kitchen");

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    preparing: 0,
    prepared: 0,
    issues: 0,
  });

  const token = localStorage.getItem("token");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ============================================================
  // FETCH ORDERS
  // ============================================================

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${apiUrl}/api/orders/chef`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch orders");
      }

      const orderList = result.data || result;

      setOrders(orderList);
      calculateStats(orderList);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl]);

  // ============================================================
  // INITIAL FETCH
  // ============================================================

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ============================================================
  // SOCKET REAL-TIME UPDATES
  // ============================================================

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribeOrderUpdate = on("orderUpdate", (updatedOrder) => {
      setOrders((prev) => {
        const newOrders = prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        );

        calculateStats(newOrders);

        return newOrders;
      });
    });

    const unsubscribeNewOrder = on("newOrderForChef", (newOrder) => {
      setOrders((prev) => {
        const newOrders = [newOrder, ...prev];

        calculateStats(newOrders);

        return newOrders;
      });
    });

    return () => {
      unsubscribeOrderUpdate?.();
      unsubscribeNewOrder?.();
    };
  }, [isConnected, on]);

  // ============================================================
  // CALCULATE STATS
  // ============================================================

  const calculateStats = (orderList) => {
    setStats({
      total: orderList.length,

      confirmed: orderList.filter((order) => order.status === "confirmed")
        .length,

      preparing: orderList.filter((order) => order.status === "preparing")
        .length,

      prepared: orderList.filter((order) => order.status === "prepared").length,

      issues: orderList.filter((order) => order.status === "issue").length,
    });
  };

  // ============================================================
  // FILTER ORDERS
  // ============================================================

  const getFilteredOrders = () => {
    switch (filter) {
      case "confirmed":
        return orders.filter((order) => order.status === "confirmed");

      case "preparing":
        return orders.filter((order) => order.status === "preparing");

      case "prepared":
        return orders.filter((order) => order.status === "prepared");

      case "issue":
        return orders.filter((order) => order.status === "issue");

      default:
        return orders.filter(
          (order) =>
            order.status === "confirmed" ||
            order.status === "preparing" ||
            order.status === "issue",
        );
    }
  };

  // ============================================================
  // START PREPARING
  // ============================================================

  const handleStartPreparing = async (orderId) => {
    setActionLoading(true);

    try {
      const response = await fetch(
        `${apiUrl}/api/chef/order/${orderId}/start-preparing`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            notes: "Kitchen staff started preparation",
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();

        setOrders((prev) => {
          const newOrders = prev.map((order) =>
            order._id === orderId ? data.data : order,
          );

          calculateStats(newOrders);

          return newOrders;
        });

        setSelectedOrder(null);
      } else {
        alert("Failed to start preparation");
      }
    } catch (error) {
      console.error("Error starting preparation:", error);

      alert("Error starting preparation");
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // MARK AS PREPARED
  // ============================================================

  const handleMarkAsPrepared = async (orderId) => {
    setActionLoading(true);

    try {
      const response = await fetch(
        `${apiUrl}/api/chef/order/${orderId}/prepared`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            notes: "Order prepared and ready for delivery",
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();

        setOrders((prev) => {
          const newOrders = prev.map((order) =>
            order._id === orderId ? data.data : order,
          );

          calculateStats(newOrders);

          return newOrders;
        });

        setSelectedOrder(null);
      } else {
        alert("Failed to mark order as prepared");
      }
    } catch (error) {
      console.error("Error marking order as prepared:", error);

      alert("Error marking order as prepared");
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // REPORT ISSUE
  // ============================================================

  const handleReportIssue = async (orderId, issueDescription) => {
    setActionLoading(true);

    try {
      const response = await fetch(
        `${apiUrl}/api/chef/order/${orderId}/issue`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            notes: issueDescription,
            issue: issueDescription,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();

        setOrders((prev) => {
          const newOrders = prev.map((order) =>
            order._id === orderId ? data.data : order,
          );

          calculateStats(newOrders);

          return newOrders;
        });

        setShowIssueModal(false);
        setSelectedOrder(null);
      } else {
        alert("Failed to report issue");
      }
    } catch (error) {
      console.error("Error reporting issue:", error);

      alert("Error reporting issue");
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await logout();

      // Redirect to authentication page
      window.location.href = "/auth";
    } catch (error) {
      console.error("Logout failed:", error);

      // Redirect even if logout request fails
      window.location.href = "/auth";
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ============================================================
  // USER INITIALS
  // ============================================================

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .filter(Boolean)
        .map((name) => name.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  // ============================================================
  // DISPLAY NAME
  // ============================================================

  const getDisplayName = () => {
    if (user?.name) {
      return user.name;
    }

    if (user?.email) {
      return user.email.split("@")[0];
    }

    return "Kitchen Staff";
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>

          <p className="text-slate-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* LEFT - PAGE TITLE */}

          <div className="flex items-center gap-3">
            <ChefHat size={32} className="text-orange-600" />

            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Kitchen Orders
              </h1>

              <p className="text-slate-600">
                Manage incoming orders and preparation status
              </p>
            </div>
          </div>

          {/* ==================================================
              USER SECTION
          =================================================== */}

          <div className="relative group">
            {/* User button */}

            <button
              type="button"
              className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
            >
              {/* Avatar */}

              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold shadow-sm">
                {getInitials()}
              </div>

              {/* User details */}

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-900">
                  {getDisplayName()}
                </p>

                <p className="text-xs text-slate-500">Kitchen Staff</p>
              </div>

              <ChevronDown className="w-4 h-4 text-slate-500 transition-transform duration-200 group-hover:rotate-180" />
            </button>

            {/* ==================================================
                HOVER DROPDOWN
            =================================================== */}

            <div className="absolute right-0 top-full pt-2 w-52 z-50 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
              <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                {/* User info */}

                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {getDisplayName()}
                  </p>

                  {user?.email && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  )}
                </div>

                {/* Profile */}

                <button
                  type="button"
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    // Add your profile action here later
                    console.log("Profile clicked");
                  }}
                >
                  <User className="w-4 h-4" />

                  <span>Profile</span>
                </button>

                {/* Divider */}

                <div className="border-t border-slate-100" />

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4" />

                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          STATS CARDS
      ======================================================= */}

      <StatsCards stats={stats} filter={filter} onFilterChange={setFilter} />

      {/* ======================================================
          ORDERS TABLE
      ======================================================= */}

      <OrdersTable
        orders={filteredOrders}
        actionLoading={actionLoading}
        onViewDetails={(order) => {
          setSelectedOrder(order);
          setShowDetailModal(true);
        }}
        onStartPreparing={handleStartPreparing}
        onMarkPrepared={handleMarkAsPrepared}
        onReportIssue={(order) => {
          setSelectedOrder(order);
          setShowIssueModal(true);
        }}
      />

      {/* ======================================================
          ORDER DETAIL MODAL
      ======================================================= */}

      {showDetailModal && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailModal(false);
          }}
          onStartPreparing={handleStartPreparing}
          onMarkPrepared={handleMarkAsPrepared}
          actionLoading={actionLoading}
        />
      )}

      {/* ======================================================
          ISSUE MODAL
      ======================================================= */}

      {showIssueModal && (
        <IssueModal
          order={selectedOrder}
          onClose={() => {
            setShowIssueModal(false);
            setSelectedOrder(null);
          }}
          onSubmit={handleReportIssue}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default KitchenOrders;
