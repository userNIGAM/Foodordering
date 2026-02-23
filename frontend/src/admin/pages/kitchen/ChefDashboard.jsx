import { useEffect, useState } from "react";
import useSocket from "../../../hooks/useSocket";
import "./ChefDashboard.css";

const ChefDashboard = () => {
  const { isConnected, on, emit } = useSocket();
  const [chef, setChef] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [showIssueModal, setShowIssueModal] = useState(false);

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch chef dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/chef/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setChef(data.data.chef);
          setStats(data.data.stats);
          setOrders(data.data.preparedOrders || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, apiUrl]);

  // Fetch assigned orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/chef/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token, apiUrl]);

  // Listen to real-time updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = on("order:confirmed", (data) => {
      console.log("Order confirmed:", data);
      setOrders((prev) =>
        prev.map((o) => (o._id === data.orderId ? { ...o, status: "confirmed" } : o))
      );
    });

    return unsubscribe;
  }, [isConnected, on]);

  // Confirm order
  const confirmOrder = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/chef/${orderId}/confirm`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: "Order confirmed by chef",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? data.data : o))
        );
        alert("✅ Order confirmed!");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("❌ Failed to confirm order");
    } finally {
      setActionLoading(false);
    }
  };

  // Start preparing
  const startPreparing = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/chef/${orderId}/start-preparing`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? data.data : o))
        );
        alert("🍳 Preparation started!");
      }
    } catch (error) {
      console.error("Error starting preparation:", error);
      alert("❌ Failed to start preparation");
    } finally {
      setActionLoading(false);
    }
  };

  // Mark as prepared
  const markPrepared = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/chef/${orderId}/prepared`, {
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
        alert("✅ Order marked as prepared!");
      }
    } catch (error) {
      console.error("Error marking prepared:", error);
      alert("❌ Failed to mark order as prepared");
    } finally {
      setActionLoading(false);
    }
  };

  // Report issue
  const reportIssue = async (orderId) => {
    if (!issueDescription.trim()) {
      alert("Please describe the issue");
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/chef/${orderId}/issue`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: issueDescription,
          severity: "high",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? data.data : o))
        );
        setShowIssueModal(false);
        setIssueDescription("");
        alert("⚠️ Issue reported to admin!");
      }
    } catch (error) {
      console.error("Error reporting issue:", error);
      alert("❌ Failed to report issue");
    } finally {
      setActionLoading(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      assigned_to_kitchen: "badge-warning",
      confirmed: "badge-info",
      preparing: "badge-primary",
      prepared: "badge-success",
      issue: "badge-danger",
    };
    return colors[status] || "badge-secondary";
  };

  // Get action buttons for order
  const getActionButtons = (order) => {
    switch (order.status) {
      case "assigned_to_kitchen":
        return (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => confirmOrder(order._id)}
            disabled={actionLoading}
          >
            {actionLoading ? "..." : "Confirm"}
          </button>
        );
      case "confirmed":
        return (
          <button
            className="btn btn-sm btn-warning"
            onClick={() => startPreparing(order._id)}
            disabled={actionLoading}
          >
            {actionLoading ? "..." : "Start Preparing"}
          </button>
        );
      case "preparing":
        return (
          <button
            className="btn btn-sm btn-success"
            onClick={() => markPrepared(order._id)}
            disabled={actionLoading}
          >
            {actionLoading ? "..." : "Mark Prepared"}
          </button>
        );
      default:
        return <span className="text-muted">No actions</span>;
    }
  };

  if (loading) {
    return (
      <div className="chef-dashboard">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chef-dashboard">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <h1 className="mb-0">👨‍🍳 Chef Dashboard</h1>
            {chef && <p className="text-muted mb-0">Welcome, {chef.name}</p>}
          </div>
          <div className="col-auto">
            <span className={`badge ${isConnected ? "bg-success" : "bg-danger"}`}>
              {isConnected ? "🟢 Live" : "🔴 Offline"}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card stat-card">
                <div className="card-body">
                  <h6 className="card-title text-muted">Total Orders</h6>
                  <h2 className="mb-0">{stats.totalOrders}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card stat-card">
                <div className="card-body">
                  <h6 className="card-title text-muted">In Progress</h6>
                  <h2 className="mb-0 text-warning">{stats.inProgress}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card stat-card">
                <div className="card-body">
                  <h6 className="card-title text-muted">Completed Today</h6>
                  <h2 className="mb-0 text-success">{stats.completed}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card stat-card">
                <div className="card-body">
                  <h6 className="card-title text-muted">Capacity</h6>
                  <h2 className="mb-0">
                    {stats.currentCapacity}/{stats.maxCapacity}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="card">
          <div className="card-header bg-light">
            <h5 className="mb-0">📋 Assigned Orders</h5>
          </div>
          <div className="card-body">
            {orders.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No orders assigned yet</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <strong>{order.orderId}</strong>
                        </td>
                        <td>{order.customer?.name || "N/A"}</td>
                        <td>
                          <small>
                            {order.items?.length || 0} items
                          </small>
                        </td>
                        <td>
                          <span className={`badge ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            {getActionButtons(order)}
                            {order.status !== "prepared" && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => {
                                  setSelectedOrder(order._id);
                                  setShowIssueModal(true);
                                }}
                                disabled={actionLoading}
                              >
                                ⚠️ Issue
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
        </div>
      </div>

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">⚠️ Report Issue</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowIssueModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe the issue..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowIssueModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => reportIssue(selectedOrder)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "..." : "Report Issue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefDashboard;
