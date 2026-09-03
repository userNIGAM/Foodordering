import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../features/Auth/AuthContext";

const useChefDashboard = () => {
  const [chef, setChef] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const token = localStorage.getItem("token");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const endpoint = user?.role === "chef"
          ? `${apiUrl}/api/chef/dashboard`
          : `${apiUrl}/api/admin/orders`;
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) return;

        const data = await response.json();

        if (user?.role === "chef") {
          setChef(data.data.chef);
          setStats(data.data.stats);
        } else {
          const orders = data.data || [];
          setStats({
            totalOrders: orders.length,
            inProgress: orders.filter((order) => ["confirmed", "preparing"].includes(order.status)).length,
            completed: orders.filter((order) => order.status === "prepared").length,
            currentCapacity: orders.filter((order) => ["confirmed", "preparing"].includes(order.status)).length,
            maxCapacity: orders.length,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, apiUrl, user?.role]);

  return {
    chef,
    stats,
    loading,
  };
};

export default useChefDashboard;
