import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../features/Auth/AuthContext";

const useChefOrders = () => {
  const [orders, setOrders] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const isChef = user?.role === "chef";

  const token = localStorage.getItem("token");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}${isChef ? "/api/chef/orders" : "/api/admin/orders"}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) return;

        const data = await response.json();

        setOrders(data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token, apiUrl, isChef]);

  // Confirm
  const confirmOrder = async (orderId) => {
    setActionLoading(true);

    try {
      const response = await fetch(isChef ? `${apiUrl}/api/chef/order/${orderId}/confirm` : `${apiUrl}/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isChef ? { notes: "Order confirmed by chef" } : { status: "confirmed" }),
      });

      if (!response.ok) {
        throw new Error("Failed to confirm order");
      }

      const data = await response.json();

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? data.data : order)),
      );

      alert("✅ Order confirmed!");
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
      const response = await fetch(
        isChef ? `${apiUrl}/api/chef/order/${orderId}/start-preparing` : `${apiUrl}/api/admin/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(isChef ? {} : { status: "preparing" }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to start preparation");
      }

      const data = await response.json();

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? data.data : order)),
      );

      alert("🍳 Preparation started!");
    } catch (error) {
      console.error("Error starting preparation:", error);

      alert("❌ Failed to start preparation");
    } finally {
      setActionLoading(false);
    }
  };

  // Mark prepared
  const markPrepared = async (orderId) => {
    setActionLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/chef/order/${orderId}/prepared`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
          body: JSON.stringify(isChef ? { notes: "Order prepared and ready for delivery" } : { status: "prepared" }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark order prepared");
      }

      const data = await response.json();

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? data.data : order)),
      );

      alert("✅ Order marked as prepared!");
    } catch (error) {
      console.error("Error marking prepared:", error);

      alert("❌ Failed to mark order as prepared");
    } finally {
      setActionLoading(false);
    }
  };

  // Report issue
  const reportIssue = async (orderId, description) => {
    if (!description.trim()) {
      alert("Please describe the issue");
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch(isChef ? `${apiUrl}/api/chef/order/${orderId}/issue` : `${apiUrl}/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isChef ? { description, severity: "high" } : { status: "issue", notes: description }),
      });

      if (!response.ok) {
        throw new Error("Failed to report issue");
      }

      const data = await response.json();

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? data.data : order)),
      );

      alert("⚠️ Issue reported to admin!");
    } catch (error) {
      console.error("Error reporting issue:", error);

      alert("❌ Failed to report issue");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    orders,
    setOrders,
    actionLoading,

    confirmOrder,
    startPreparing,
    markPrepared,
    reportIssue,
  };
};

export default useChefOrders;
