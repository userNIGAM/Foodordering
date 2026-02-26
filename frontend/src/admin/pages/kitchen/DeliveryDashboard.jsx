import { useEffect, useState } from "react";
import useSocket from "../../../hooks/useSocket";

const DeliveryDashboard = () => {
  const { isConnected, on, emit } = useSocket();
  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const [stats, setStats] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationForm, setLocationForm] = useState({
    latitude: 0,
    longitude: 0,
    address: "",
  });

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationForm((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => console.warn("Unable to get location:", error)
      );
    }
  }, []);

  // Fetch delivery dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/delivery/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDeliveryPerson(data.data.deliveryPerson);
          setStats(data.data.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, apiUrl]);

  // Fetch assigned deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/delivery/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDeliveries(data.data);
        }
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    fetchDeliveries();
  }, [token, apiUrl]);

  // Listen to real-time updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = on("order:picked_up", (data) => {
      console.log("Order picked up:", data);
      setDeliveries((prev) =>
        prev.map((d) => (d._id === data.orderId ? { ...d, status: "picked_up" } : d))
      );
    });

    return unsubscribe;
  }, [isConnected, on]);

  // Pickup order
  const pickupOrder = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/delivery/${orderId}/pickup`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: "Order picked up from kitchen",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDeliveries((prev) =>
          prev.map((d) => (d._id === orderId ? data.data : d))
        );
        alert("📦 Order picked up!");
      }
    } catch (error) {
      console.error("Error picking up order:", error);
      alert("❌ Failed to pick up order");
    } finally {
      setActionLoading(false);
    }
  };

  // Mark as in transit
  const markInTransit = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/delivery/${orderId}/in-transit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: currentLocation?.latitude || locationForm.latitude,
          longitude: currentLocation?.longitude || locationForm.longitude,
          address: locationForm.address,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDeliveries((prev) =>
          prev.map((d) => (d._id === orderId ? data.data : d))
        );
        alert("🚗 Marked as in transit!");
      }
    } catch (error) {
      console.error("Error marking in transit:", error);
      alert("❌ Failed to mark as in transit");
    } finally {
      setActionLoading(false);
    }
  };

  // Update location during transit
  const updateLocation = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/delivery/${orderId}/location`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: currentLocation?.latitude || locationForm.latitude,
          longitude: currentLocation?.longitude || locationForm.longitude,
          address: locationForm.address,
        }),
      });

      if (response.ok) {
        // Emit socket event for real-time location update
        emit("delivery:location_update", {
          orderId,
          latitude: currentLocation?.latitude || locationForm.latitude,
          longitude: currentLocation?.longitude || locationForm.longitude,
        });
        alert("📍 Location updated!");
        setShowLocationModal(false);
      }
    } catch (error) {
      console.error("Error updating location:", error);
      alert("❌ Failed to update location");
    } finally {
      setActionLoading(false);
    }
  };

  // Mark as delivered
  const deliverOrder = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/delivery/${orderId}/deliver`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: "Order delivered successfully",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDeliveries((prev) =>
          prev.filter((d) => d._id !== orderId)
        );
        alert("✅ Order delivered!");
      }
    } catch (error) {
      console.error("Error delivering order:", error);
      alert("❌ Failed to deliver order");
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel delivery
  const cancelDelivery = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this delivery?")) return;

    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/delivery/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: "Cancelled by delivery person",
        }),
      });

      if (response.ok) {
        setDeliveries((prev) =>
          prev.filter((d) => d._id !== orderId)
        );
        alert("🚫 Delivery cancelled!");
      }
    } catch (error) {
      console.error("Error cancelling delivery:", error);
      alert("❌ Failed to cancel delivery");
    } finally {
      setActionLoading(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      assigned_to_delivery: "badge-warning",
      picked_up: "badge-info",
      out_for_delivery: "badge-primary",
      delivered: "badge-success",
    };
    return colors[status] || "badge-secondary";
  };

  // Get action buttons for delivery
  const getActionButtons = (delivery) => {
    switch (delivery.status) {
      case "assigned_to_delivery":
        return (
          <button
            className="btn btn-sm btn-warning"
            onClick={() => pickupOrder(delivery._id)}
            disabled={actionLoading}
          >
            {actionLoading ? "..." : "📦 Pickup"}
          </button>
        );
      case "picked_up":
        return (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => markInTransit(delivery._id)}
            disabled={actionLoading}
          >
            {actionLoading ? "..." : "🚗 In Transit"}
          </button>
        );
      case "out_for_delivery":
        return (
          <div className="btn-group btn-group-sm">
            <button
              className="btn btn-success"
              onClick={() => deliverOrder(delivery._id)}
              disabled={actionLoading}
            >
              {actionLoading ? "..." : "✅ Delivered"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSelectedDelivery(delivery._id);
                setShowLocationModal(true);
              }}
              disabled={actionLoading}
            >
              📍 Update Location
            </button>
          </div>
        );
      default:
        return <span className="text-muted">No actions</span>;
    }
  };

  if (loading) {
    return (
      <div className="delivery-dashboard">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="delivery-dashboard">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <h1 className="mb-0">🚗 Delivery Dashboard</h1>
            {deliveryPerson && <p className="text-muted mb-0">Welcome, {deliveryPerson.name}</p>}
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
                  <h6 className="card-title text-muted">Total Deliveries</h6>
                  <h2 className="mb-0">{stats.totalOrders}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card stat-card">
                <div className="card-body">
                  <h6 className="card-title text-muted">In Transit</h6>
                  <h2 className="mb-0 text-primary">{stats.inTransit}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card stat-card">
                <div className="card-body">
                  <h6 className="card-title text-muted">Delivered Today</h6>
                  <h2 className="mb-0 text-success">{stats.delivered}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card stat-card">
                <div className="card-body">
                  <h6 className="card-title text-muted">Rating</h6>
                  <h2 className="mb-0">
                    ⭐ {stats.rating?.toFixed(1) || "N/A"}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Deliveries */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">📦 Active Deliveries</h5>
          </div>
          <div className="card-body">
            {deliveries.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No active deliveries</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((delivery) => (
                      <tr key={delivery._id}>
                        <td>
                          <strong>{delivery.orderId}</strong>
                        </td>
                        <td>{delivery.customer?.name || "N/A"}</td>
                        <td>
                          <small>{delivery.customer?.address || "N/A"}</small>
                        </td>
                        <td>
                          <span className={`badge ${getStatusColor(delivery.status)}`}>
                            {delivery.status}
                          </span>
                        </td>
                        <td>
                          <strong>₹{delivery.total || 0}</strong>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            {getActionButtons(delivery)}
                            {delivery.status !== "delivered" && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => cancelDelivery(delivery._id)}
                                disabled={actionLoading}
                              >
                                🚫 Cancel
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

        {/* Pending Pickups */}
        <div className="card">
          <div className="card-header bg-light">
            <h5 className="mb-0">⏳ Pending Pickups</h5>
          </div>
          <div className="card-body">
            {deliveries.filter((d) => d.status === "assigned_to_delivery").length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No pending pickups</p>
              </div>
            ) : (
              <div className="row g-3">
                {deliveries
                  .filter((d) => d.status === "assigned_to_delivery")
                  .map((delivery) => (
                    <div key={delivery._id} className="col-md-6">
                      <div className="card pending-card">
                        <div className="card-body">
                          <h6 className="mb-2">Order #{delivery.orderId}</h6>
                          <p className="mb-1">
                            <strong>Customer:</strong> {delivery.customer?.name}
                          </p>
                          <p className="mb-1">
                            <strong>Address:</strong> {delivery.customer?.address}
                          </p>
                          <p className="mb-3">
                            <strong>Total:</strong> ₹{delivery.total}
                          </p>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => pickupOrder(delivery._id)}
                            disabled={actionLoading}
                          >
                            {actionLoading ? "..." : "📦 Pickup Order"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Update Modal */}
      {showLocationModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📍 Update Delivery Location</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLocationModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    className="form-control"
                    step="0.00000001"
                    value={locationForm.latitude}
                    onChange={(e) =>
                      setLocationForm((prev) => ({
                        ...prev,
                        latitude: parseFloat(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    className="form-control"
                    step="0.00000001"
                    value={locationForm.longitude}
                    onChange={(e) =>
                      setLocationForm((prev) => ({
                        ...prev,
                        longitude: parseFloat(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={locationForm.address}
                    onChange={(e) =>
                      setLocationForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="e.g., Near XYZ, Building 123"
                  />
                </div>
                {currentLocation && (
                  <div className="alert alert-info">
                    <small>
                      📍 Current location: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLocationModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => updateLocation(selectedDelivery)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "..." : "Update Location"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
