import React, { useEffect, useState, useCallback } from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ChefHat,
  Plus,
  EyeIcon,
  MessageSquare,
} from "lucide-react";
import useSocket from "../../hooks/useSocket";
import "./KitchenOrders.css";

const KitchenOrders = () => {
  const { isConnected, on } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [filter, setFilter] = useState("assigned_to_kitchen");
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    preparing: 0,
    prepared: 0,
    issues: 0,
  });

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/chef/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
        calculateStats(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Listen for real-time updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribeOrderUpdate = on("orderUpdate", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
      calculateStats(
        orders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    const unsubscribeNewOrder = on("newOrderForChef", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      calculateStats([newOrder, ...orders]);
    });

    return () => {
      unsubscribeOrderUpdate?.();
      unsubscribeNewOrder?.();
    };
  }, [isConnected, on, orders]);

  // Calculate stats
  const calculateStats = (orderList) => {
    const stats = {
      total: orderList.length,
      confirmed: orderList.filter((o) => o.status === "confirmed").length,
      preparing: orderList.filter((o) => o.status === "preparing").length,
      prepared: orderList.filter((o) => o.status === "prepared").length,
      issues: orderList.filter((o) => o.status === "issue").length,
    };
    setStats(stats);
  };

  // Filter orders based on status
  const getFilteredOrders = () => {
    switch (filter) {
      case "confirmed":
        return orders.filter((o) => o.status === "confirmed");
      case "preparing":
        return orders.filter((o) => o.status === "preparing");
      case "prepared":
        return orders.filter((o) => o.status === "prepared");
      case "issue":
        return orders.filter((o) => o.status === "issue");
      default:
        return orders.filter(
          (o) =>
            o.status === "confirmed" ||
            o.status === "preparing" ||
            o.status === "issue"
        );
    }
  };

  // Confirm order
//   const handleConfirmOrder = async (orderId) => {
//     setActionLoading(true);
//     try {
//       const response = await fetch(`${apiUrl}/api/chef/order/${orderId}/confirm`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           notes: "Order confirmed by kitchen staff",
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setOrders((prev) =>
//           prev.map((o) => (o._id === orderId ? data.data : o))
//         );
//         setSelectedOrder(null);
//       } else {
//         alert("Failed to confirm order");
//       }
//     } catch (error) {
//       console.error("Error confirming order:", error);
//       alert("Error confirming order");
//     } finally {
//       setActionLoading(false);
//     }
//   };

  // Start preparing
  const handleStartPreparing = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/chef/order/${orderId}/start-preparing`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: "Kitchen staff started preparation",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? data.data : o))
        );
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

  // Mark as prepared
  const handleMarkAsPrepared = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/chef/order/${orderId}/prepared`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: "Order prepared and ready for delivery",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? data.data : o))
        );
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

  // Report issue
  const handleReportIssue = async (orderId) => {
    if (!issueDescription.trim()) {
      alert("Please describe the issue");
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/chef/order/${orderId}/issue`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: issueDescription,
          issue: issueDescription,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? data.data : o))
        );
        setShowIssueModal(false);
        setIssueDescription("");
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

  // Get status badge styles
  const getStatusBadgeStyles = (status) => {
    const baseStyles =
      "px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-2";
    switch (status) {
      case "confirmed":
        return `${baseStyles} bg-blue-100 text-blue-800`;
      case "preparing":
        return `${baseStyles} bg-yellow-100 text-yellow-800`;
      case "prepared":
        return `${baseStyles} bg-green-100 text-green-800`;
      case "issue":
        return `${baseStyles} bg-red-100 text-red-800`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={16} />;
      case "preparing":
        return <ChefHat size={16} />;
      case "prepared":
        return <CheckCircle size={16} />;
      case "issue":
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  // Time since order
  const getTimeAgo = (date) => {
    const now = new Date();
    const orderDate = new Date(date);
    const minutes = Math.floor((now - orderDate) / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return orderDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="kitchen-orders-container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <ChefHat size={32} className="text-orange-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kitchen Orders</h1>
            <p className="text-gray-600">Manage incoming orders and preparation status</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg shadow ${
            filter === "assigned_to_kitchen"
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-white cursor-pointer hover:shadow-md"
          }`}
          onClick={() => setFilter("assigned_to_kitchen")}
        >
          <p className="text-sm font-semibold opacity-80">Total Orders</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div
          className={`p-4 rounded-lg shadow ${
            filter === "confirmed"
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-white cursor-pointer hover:shadow-md"
          }`}
          onClick={() => setFilter("confirmed")}
        >
          <p className="text-sm font-semibold opacity-80">Confirmed</p>
          <p className="text-2xl font-bold">{stats.confirmed}</p>
        </div>

        <div
          className={`p-4 rounded-lg shadow ${
            filter === "preparing"
              ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white"
              : "bg-white cursor-pointer hover:shadow-md"
          }`}
          onClick={() => setFilter("preparing")}
        >
          <p className="text-sm font-semibold opacity-80">Preparing</p>
          <p className="text-2xl font-bold">{stats.preparing}</p>
        </div>

        <div
          className={`p-4 rounded-lg shadow ${
            filter === "prepared"
              ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
              : "bg-white cursor-pointer hover:shadow-md"
          }`}
          onClick={() => setFilter("prepared")}
        >
          <p className="text-sm font-semibold opacity-80">Prepared</p>
          <p className="text-2xl font-bold">{stats.prepared}</p>
        </div>

        <div
          className={`p-4 rounded-lg shadow ${
            filter === "issue"
              ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
              : "bg-white cursor-pointer hover:shadow-md"
          }`}
          onClick={() => setFilter("issue")}
        >
          <p className="text-sm font-semibold opacity-80">Issues</p>
          <p className="text-2xl font-bold">{stats.issues}</p>
        </div>
      </div>

      {/* Orders Display */}
      <div className="bg-white rounded-lg shadow">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <ChefHat size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No orders to display</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        #{order.orderId || order._id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.customer?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.customer?.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {order.items?.length} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadgeStyles(order.status)}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {getTimeAgo(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailModal(true);
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium flex items-center gap-1"
                        >
                          <EyeIcon size={16} /> View
                        </button>
                        {order.status === "confirmed" && (
                          <button
                            onClick={() => handleStartPreparing(order._id)}
                            disabled={actionLoading}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm font-medium disabled:opacity-50"
                          >
                            Prepare
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button
                            onClick={() => handleMarkAsPrepared(order._id)}
                            disabled={actionLoading}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium disabled:opacity-50"
                          >
                            Done
                          </button>
                        )}
                        {(order.status === "confirmed" ||
                          order.status === "preparing") && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowIssueModal(true);
                            }}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium flex items-center gap-1"
                          >
                            <AlertCircle size={16} /> Issue
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrder.orderId || selectedOrder._id.slice(-8)}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {getTimeAgo(selectedOrder.createdAt)}
                  </p>
                </div>
                <span className={getStatusBadgeStyles(selectedOrder.status)}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status.charAt(0).toUpperCase() +
                    selectedOrder.status.slice(1)}
                </span>
              </div>

              {/* Customer Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.customer?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.customer?.phone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.customer?.address}
                    </p>
                  </div>
                  {selectedOrder.customer?.specialInstructions && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Special Instructions</p>
                      <p className="font-medium text-gray-900">
                        {selectedOrder.customer?.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <p className="font-semibold text-gray-900">Total</p>
                  <p className="text-xl font-bold text-orange-600">
                    ${selectedOrder.total?.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedOrder.status === "confirmed" && (
                  <button
                    onClick={() => {
                      handleStartPreparing(selectedOrder._id);
                      setShowDetailModal(false);
                    }}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium disabled:opacity-50"
                  >
                    Start Preparing
                  </button>
                )}
                {selectedOrder.status === "preparing" && (
                  <button
                    onClick={() => {
                      handleMarkAsPrepared(selectedOrder._id);
                      setShowDetailModal(false);
                    }}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:opacity-50"
                  >
                    Mark as Prepared
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issue Modal */}
      {showIssueModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={24} className="text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Report Issue</h2>
              </div>

              <p className="text-gray-600 mb-4">
                Order #{selectedOrder.orderId || selectedOrder._id.slice(-8)}
              </p>

              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                rows={4}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleReportIssue(selectedOrder._id);
                    setShowIssueModal(false);
                  }}
                  disabled={actionLoading || !issueDescription.trim()}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium disabled:opacity-50"
                >
                  Report Issue
                </button>
                <button
                  onClick={() => {
                    setShowIssueModal(false);
                    setIssueDescription("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenOrders;
