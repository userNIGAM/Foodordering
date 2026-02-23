import { useEffect, useState } from "react";
import useSocket from "../../../hooks/useSocket";
import "./KitchenDisplaySystem.css";

const KitchenDisplaySystem = () => {
  const { isConnected, on } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKitchen, setSelectedKitchen] = useState(null);
  const [kitchens, setKitchens] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    preparing: 0,
    prepared: 0,
  });

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch kitchens
  useEffect(() => {
    const fetchKitchens = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/kitchen`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setKitchens(data.data || []);
          if (data.data && data.data.length > 0) {
            setSelectedKitchen(data.data[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching kitchens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKitchens();
  }, [token, apiUrl]);

  // Fetch orders for selected kitchen
  useEffect(() => {
    if (!selectedKitchen) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/orders/manage/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Filter by kitchen if needed
          const filteredOrders = data.data || [];
          setOrders(filteredOrders);
          updateStats(filteredOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [selectedKitchen, token, apiUrl]);

  // Listen to real-time order updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribeConfirmed = on("order:confirmed", (data) => {
      console.log("Order confirmed:", data);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.orderId ? { ...o, status: "confirmed" } : o
        )
      );
    });

    const unsubscribePreparing = on("order:preparing", (data) => {
      console.log("Order in preparation:", data);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.orderId ? { ...o, status: "preparing" } : o
        )
      );
    });

    const unsubscribePrepared = on("order:prepared", (data) => {
      console.log("Order prepared:", data);
      setOrders((prev) =>
        prev.filter((o) => o._id !== data.orderId) // Remove from KDS once prepared
      );
    });

    return () => {
      unsubscribeConfirmed && unsubscribeConfirmed();
      unsubscribePreparing && unsubscribePreparing();
      unsubscribePrepared && unsubscribePrepared();
    };
  }, [isConnected, on]);

  // Update stats
  const updateStats = (ordersList) => {
    const newStats = {
      total: ordersList.length,
      confirmed: ordersList.filter((o) => o.status === "confirmed").length,
      preparing: ordersList.filter((o) => o.status === "preparing").length,
      prepared: ordersList.filter((o) => o.status === "prepared").length,
    };
    setStats(newStats);
  };

  // Get order color based on status
  const getOrderColor = (status) => {
    switch (status) {
      case "assigned_to_kitchen":
        return "order-new";
      case "confirmed":
        return "order-confirmed";
      case "preparing":
        return "order-preparing";
      case "prepared":
        return "order-prepared";
      default:
        return "order-default";
    }
  };

  // Get remaining time estimate
  const getRemainingTime = (createdAt, estimatedPrepTime = 30) => {
    const created = new Date(createdAt);
    const elapsed = Math.floor((Date.now() - created) / 60000);
    const remaining = Math.max(0, estimatedPrepTime - elapsed);
    return remaining;
  };

  if (loading) {
    return (
      <div className="kds">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kds">
      {/* Header */}
      <div className="kds-header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="mb-0">🍳 Kitchen Display System</h1>
            </div>
            <div className="col-auto">
              <span className={`badge ${isConnected ? "bg-success" : "bg-danger"} fs-6`}>
                {isConnected ? "🟢 LIVE" : "🔴 OFFLINE"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Kitchen Selector */}
      <div className="kds-selector">
        <div className="container-fluid">
          <select
            className="form-select"
            value={selectedKitchen || ""}
            onChange={(e) => setSelectedKitchen(e.target.value)}
          >
            <option value="">Select Kitchen</option>
            {kitchens.map((kitchen) => (
              <option key={kitchen._id} value={kitchen._id}>
                {kitchen.name} - {kitchen.location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="kds-stats">
        <div className="container-fluid">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-item">
              <div className="stat-value text-warning">{stats.confirmed}</div>
              <div className="stat-label">Confirmed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value text-primary">{stats.preparing}</div>
              <div className="stat-label">Preparing</div>
            </div>
            <div className="stat-item">
              <div className="stat-value text-success">{stats.prepared}</div>
              <div className="stat-label">Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Display */}
      <div className="kds-orders">
        <div className="container-fluid">
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No active orders</p>
            </div>
          ) : (
            <div className="orders-grid">
              {orders
                .sort((a, b) => {
                  // Priority: confirmed first, then preparing
                  const statusOrder = {
                    assigned_to_kitchen: 1,
                    confirmed: 2,
                    preparing: 3,
                  };
                  return (
                    (statusOrder[b.status] || 0) -
                    (statusOrder[a.status] || 0)
                  );
                })
                .map((order) => (
                  <div
                    key={order._id}
                    className={`order-card ${getOrderColor(order.status)}`}
                  >
                    {/* Card Header */}
                    <div className="order-header">
                      <div className="order-number">
                        #{order.orderId}
                      </div>
                      <div className="order-status-badge">
                        {order.status === "assigned_to_kitchen" && "📋 New"}
                        {order.status === "confirmed" && "✓ Confirmed"}
                        {order.status === "preparing" && "🍳 Preparing"}
                        {order.status === "prepared" && "✅ Ready"}
                      </div>
                    </div>

                    {/* Customer & Items */}
                    <div className="order-body">
                      <div className="customer-name">
                        👤 {order.customer?.name || "Unknown"}
                      </div>

                      <div className="items-list">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div key={idx} className="item">
                              <span className="item-name">
                                {item.name}
                              </span>
                              <span className="item-qty">
                                x{item.quantity}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted">No items</div>
                        )}
                      </div>

                      {/* Special Instructions */}
                      {order.specialInstructions && (
                        <div className="special-instructions">
                          <small>
                            📝 {order.specialInstructions}
                          </small>
                        </div>
                      )}
                    </div>

                    {/* Footer - Time */}
                    <div className="order-footer">
                      <div className="order-time">
                        ⏱️ {getRemainingTime(order.createdAt, order.estimatedPrepTime)} min
                      </div>
                      {order.status === "preparing" && (
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${Math.min(
                                100,
                                (getRemainingTime(order.createdAt, order.estimatedPrepTime) /
                                  (order.estimatedPrepTime || 30)) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplaySystem;
