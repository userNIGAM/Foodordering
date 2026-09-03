import { useContext, useEffect, useState, useCallback } from "react";
import useSocket from "../../hooks/useSocket";
import { AuthContext } from "../../features/Auth/AuthContext";

const useDeliveryDashboard = () => {
  const { isConnected, on, emit } = useSocket();
  const { user, loading: authLoading } = useContext(AuthContext);
  const isDeliveryPerson = user?.role === "delivery_person";

  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const [stats, setStats] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [pendingPickups, setPendingPickups] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [currentLocation, setCurrentLocation] = useState(null);

  const [locationForm, setLocationForm] = useState({
    latitude: 0,
    longitude: 0,
    address: "",
  });

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* --------------------------------
     Get Browser Location
  -------------------------------- */

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setCurrentLocation(loc);

        setLocationForm((prev) => ({
          ...prev,
          ...loc,
        }));
      },
      (error) => console.warn("Location error:", error)
    );
  }, []);

  /* --------------------------------
     Fetch Dashboard
  -------------------------------- */

  const fetchDashboard = useCallback(async () => {
    if (authLoading || !user || !token) return;

    try {
      const res = await fetch(`${apiUrl}${isDeliveryPerson ? "/api/delivery/dashboard" : "/api/admin/orders"}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Dashboard request failed (${res.status})`);
      }

      const data = await res.json();

      if (isDeliveryPerson) {
        setDeliveryPerson(data.data.deliveryPerson);
        setStats(data.data.stats);
      } else {
        const orders = data.data || [];
        setStats({
          totalOrders: orders.length,
          inTransit: orders.filter((order) => order.status === "out_for_delivery").length,
          delivered: orders.filter((order) => order.status === "delivered").length,
          rating: null,
        });
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }, [apiUrl, token, user, authLoading, isDeliveryPerson]);

  /* --------------------------------
     Fetch Deliveries
  -------------------------------- */

  const fetchDeliveries = useCallback(async () => {
    if (authLoading || !user || !token) return;

    try {
      const res = await fetch(`${apiUrl}${isDeliveryPerson ? "/api/delivery/orders" : "/api/admin/orders"}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Deliveries request failed (${res.status})`);
      }

      const data = await res.json();

      setDeliveries(data.data);
    } catch (err) {
      console.error("Deliveries fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token, user, authLoading, isDeliveryPerson]);

  const fetchPendingPickups = useCallback(async () => {
    if (authLoading || !user || !token || !isDeliveryPerson) {
      setPendingPickups([]);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/delivery/pickups/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Pending pickups request failed (${res.status})`);
      }
      const data = await res.json();
      setPendingPickups(data.data || []);
    } catch (err) {
      console.error("Pending pickups fetch error:", err);
    }
  }, [apiUrl, token, user, authLoading, isDeliveryPerson]);

  /* --------------------------------
     Initial Load
  -------------------------------- */

  useEffect(() => {
    fetchDashboard();
    fetchDeliveries();
    fetchPendingPickups();
  }, [fetchDashboard, fetchDeliveries, fetchPendingPickups]);

  /* --------------------------------
     Socket Events
  -------------------------------- */

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = on("order:picked_up", (data) => {
      setDeliveries((prev) =>
        prev.map((d) =>
          d._id === data.orderId ? { ...d, status: "picked_up" } : d
        )
      );
    });

    return unsubscribe;
  }, [isConnected, on]);

  /* --------------------------------
     Actions
  -------------------------------- */

  const pickupOrder = async (orderId) => {
    setActionLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/delivery/order/${orderId}/pickup`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: "Order picked up from kitchen",
        }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setDeliveries((prev) =>
        prev.map((d) => (d._id === orderId ? data.data : d))
      );

    } catch (err) {
      console.error("Pickup error:", err);
      alert("Failed to pickup order");
    } finally {
      setActionLoading(false);
    }
  };

  const markInTransit = async (orderId) => {
    setActionLoading(true);

    try {
      const res = await fetch(
        `${apiUrl}/api/delivery/order/${orderId}/in-transit`,
        {
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
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      setDeliveries((prev) =>
        prev.map((d) => (d._id === orderId ? data.data : d))
      );

    } catch (err) {
      console.error("Transit error:", err);
      alert("Failed to mark in transit");
    } finally {
      setActionLoading(false);
    }
  };

  const updateLocation = async () => {
    if (!selectedDelivery) return;

    setActionLoading(true);

    try {
      const lat = currentLocation?.latitude || locationForm.latitude;
      const lng = currentLocation?.longitude || locationForm.longitude;

      const res = await fetch(
        `${apiUrl}/api/delivery/order/${selectedDelivery}/location`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: lat,
            longitude: lng,
            address: locationForm.address,
          }),
        }
      );

      if (!res.ok) throw new Error();

      emit("delivery:location_update", {
        orderId: selectedDelivery,
        latitude: lat,
        longitude: lng,
      });

      setShowLocationModal(false);

    } catch (err) {
      console.error("Location update error:", err);
      alert("Failed to update location");
    } finally {
      setActionLoading(false);
    }
  };

  const deliverOrder = async (orderId) => {
    setActionLoading(true);

    try {
      const res = await fetch(
        `${apiUrl}/api/delivery/order/${orderId}/deliver`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notes: "Order delivered successfully",
          }),
        }
      );

      if (!res.ok) throw new Error();

      setDeliveries((prev) => prev.filter((d) => d._id !== orderId));

    } catch (err) {
      console.error("Deliver error:", err);
      alert("Failed to deliver order");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelDelivery = async (orderId) => {
    if (!window.confirm("Cancel this delivery?")) return;

    setActionLoading(true);

    try {
      const res = await fetch(
        `${apiUrl}/api/delivery/order/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: "Cancelled by delivery person",
          }),
        }
      );

      if (!res.ok) throw new Error();

      setDeliveries((prev) => prev.filter((d) => d._id !== orderId));

    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel delivery");
    } finally {
      setActionLoading(false);
    }
  };

  const openLocation = (orderId) => {
    setSelectedDelivery(orderId);
    setShowLocationModal(true);
  };

  /* --------------------------------
     Return
  -------------------------------- */

  return {
    deliveryPerson,
    stats,
    deliveries,
    pendingPickups,
    loading,
    actionLoading,

    isConnected,

    locationForm,
    setLocationForm,

    showLocationModal,
    setShowLocationModal,

    actions: {
      pickupOrder,
      markInTransit,
      deliverOrder,
      cancelDelivery,
      updateLocation,
      openLocation,
    },
  };
};

export default useDeliveryDashboard;