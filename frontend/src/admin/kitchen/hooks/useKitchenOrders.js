import { useCallback, useEffect, useState } from "react";

const useKitchenOrders = (selectedKitchen) => {
  const [orders, setOrders] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    preparing: 0,
    prepared: 0,
  });

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const updateStats = useCallback((ordersList) => {
    setStats({
      total: ordersList.length,
      confirmed: ordersList.filter((order) => order.status === "confirmed")
        .length,
      preparing: ordersList.filter((order) => order.status === "preparing")
        .length,
      prepared: ordersList.filter((order) => order.status === "prepared")
        .length,
    });
  }, []);

  useEffect(() => {
    if (!selectedKitchen) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/kitchen/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        const fetchedOrders = data.data || [];

        setOrders(fetchedOrders);
        updateStats(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [selectedKitchen, apiUrl, token, updateStats]);

  return {
    orders,
    setOrders,
    stats,
    updateStats,
  };
};

export default useKitchenOrders;
