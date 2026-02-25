import { useEffect, useState, useCallback } from "react";
import useSocket from "../../../hooks/useSocket";

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

  /* ---------------- FETCH KITCHENS ---------------- */
  useEffect(() => {
    const fetchKitchens = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/kitchen`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const kitchenList = data.data || [];
          setKitchens(kitchenList);
          if (kitchenList.length > 0) {
            setSelectedKitchen(kitchenList[0]._id);
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

  /* ---------------- FETCH ORDERS ---------------- */
  useEffect(() => {
    if (!selectedKitchen) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/orders/manage/pending`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
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

  /* ---------------- REALTIME SOCKET ---------------- */
  useEffect(() => {
    if (!isConnected) return;

    const unsub1 = on("order:confirmed", ({ orderId }) => {
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o._id === orderId ? { ...o, status: "confirmed" } : o
        );
        updateStats(updated);
        return updated;
      });
    });

    const unsub2 = on("order:preparing", ({ orderId }) => {
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o._id === orderId ? { ...o, status: "preparing" } : o
        );
        updateStats(updated);
        return updated;
      });
    });

    const unsub3 = on("order:prepared", ({ orderId }) => {
      setOrders((prev) => {
        const updated = prev.filter((o) => o._id !== orderId);
        updateStats(updated);
        return updated;
      });
    });

    return () => {
      unsub1 && unsub1();
      unsub2 && unsub2();
      unsub3 && unsub3();
    };
  }, [isConnected, on]);

  /* ---------------- STATS ---------------- */
  const updateStats = useCallback((ordersList) => {
    setStats({
      total: ordersList.length,
      confirmed: ordersList.filter((o) => o.status === "confirmed").length,
      preparing: ordersList.filter((o) => o.status === "preparing").length,
      prepared: ordersList.filter((o) => o.status === "prepared").length,
    });
  }, []);

  /* ---------------- HELPERS ---------------- */
  const getRemainingTime = (createdAt, estimatedPrepTime = 30) => {
    const created = new Date(createdAt);
    const elapsed = Math.floor((Date.now() - created) / 60000);
    return Math.max(0, estimatedPrepTime - elapsed);
  };

  const getOrderStyles = (status) => {
    switch (status) {
      case "assigned_to_kitchen":
        return "border-orange-500 shadow-[0_0_20px_rgba(255,152,0,0.4)]";
      case "confirmed":
        return "border-blue-500 shadow-[0_0_20px_rgba(33,150,243,0.4)]";
      case "preparing":
        return "border-red-500 shadow-[0_0_25px_rgba(255,87,34,0.6)] animate-pulse";
      case "prepared":
        return "border-green-500 shadow-[0_0_20px_rgba(76,175,80,0.4)]";
      default:
        return "border-cyan-400";
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <div className="h-12 w-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex flex-col text-white bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">

      {/* HEADER */}
      <div className="bg-black/30 border-b-4 border-cyan-400 shadow-lg py-6 px-6 flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
          🍳 Kitchen Display System
        </h1>

        <span
          className={`px-4 py-2 rounded-full font-semibold text-sm ${
            isConnected
              ? "bg-green-600 shadow-green-500/50 shadow-lg"
              : "bg-red-600 shadow-red-500/50 shadow-lg"
          }`}
        >
          {isConnected ? "🟢 LIVE" : "🔴 OFFLINE"}
        </span>
      </div>

      {/* SELECTOR */}
      <div className="bg-black/20 border-b border-cyan-400/40 p-4">
        <select
          value={selectedKitchen || ""}
          onChange={(e) => setSelectedKitchen(e.target.value)}
          className="w-full md:w-96 bg-[#2a2a3e] border-2 border-cyan-400 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="">Select Kitchen</option>
          {kitchens.map((kitchen) => (
            <option key={kitchen._id} value={kitchen._id}>
              {kitchen.name} - {kitchen.location}
            </option>
          ))}
        </select>
      </div>

      {/* STATS */}
      <div className="bg-black/20 border-b border-cyan-400/40 p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: stats.total },
          { label: "Confirmed", value: stats.confirmed },
          { label: "Preparing", value: stats.preparing },
          { label: "Ready", value: stats.prepared },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 border border-cyan-400/30 rounded-xl p-6 text-center hover:-translate-y-1 transition"
          >
            <div className="text-3xl font-bold text-cyan-400">
              {stat.value}
            </div>
            <div className="text-sm uppercase tracking-wider text-gray-400 mt-2">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ORDERS */}
      <div className="flex-1 overflow-auto p-6 space-y-6
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-black/20
        [&::-webkit-scrollbar-thumb]:bg-cyan-400/60
        [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl">No active orders</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`bg-white/10 border-4 rounded-xl flex flex-col transition hover:-translate-y-2 duration-300 ${getOrderStyles(
                  order.status
                )}`}
              >
                {/* HEADER */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 flex justify-between items-center border-b border-cyan-400/40">
                  <div className="text-2xl font-bold text-cyan-400">
                    #{order.orderId}
                  </div>
                  <div className="bg-cyan-400/20 px-3 py-1 rounded-full text-sm border border-cyan-400">
                    {order.status === "assigned_to_kitchen" && "📋 New"}
                    {order.status === "confirmed" && "✓ Confirmed"}
                    {order.status === "preparing" && "🍳 Preparing"}
                    {order.status === "prepared" && "✅ Ready"}
                  </div>
                </div>

                {/* BODY */}
                <div className="p-6 flex-1">
                  <div className="font-semibold mb-4">
                    👤 {order.customer?.name || "Unknown"}
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 max-h-32 overflow-y-auto mb-4">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between border-b border-white/10 py-2 text-sm"
                      >
                        <span>{item.name}</span>
                        <span className="text-cyan-400 font-semibold">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div className="bg-orange-500/10 border-l-4 border-orange-500 p-3 rounded text-orange-300 text-sm italic">
                      📝 {order.specialInstructions}
                    </div>
                  )}
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-cyan-400/40 bg-black/20">
                  <div className="text-lg font-bold text-cyan-400 mb-2">
                    ⏱️ {getRemainingTime(order.createdAt, order.estimatedPrepTime)} min
                  </div>

                  {order.status === "preparing" && (
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-1000"
                        style={{
                          width: `${Math.min(
                            100,
                            (getRemainingTime(
                              order.createdAt,
                              order.estimatedPrepTime
                            ) /
                              (order.estimatedPrepTime || 30)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplaySystem;