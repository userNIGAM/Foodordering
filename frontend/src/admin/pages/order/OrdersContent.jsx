import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import OrdersHeader from "./OrdersHeader";
import OrdersFilters from "./OrdersFilters";
import OrdersTable from "./OrdersTable";
import Alerts from "./Alerts";
import Loader from "./Loader";

const OrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/orders");

      if (res.data.success && Array.isArray(res.data.data)) {
        setOrders(res.data.data);
      } else {
        setError("Failed to load orders: Invalid response format");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/orders/${id}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
      setSuccess("Order status updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating order");
      setTimeout(() => setError(""), 5000);
    }
  };

  const filteredOrders = orders
    .filter((order) => (filter === "all" ? true : order.status === filter))
    .filter((order) => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (
        order.orderId.toLowerCase().includes(s) ||
        order._id.toLowerCase().includes(s) ||
        order.customer?.name?.toLowerCase().includes(s)
      );
    });

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <OrdersHeader />

      <OrdersFilters
        filter={filter}
        setFilter={setFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Alerts error={error} success={success} setError={setError} setSuccess={setSuccess} />

      <OrdersTable
        orders={filteredOrders}
        totalOrders={orders.length}
        filter={filter}
        searchTerm={searchTerm}
        updateStatus={updateStatus}
      />
    </div>
  );
};

export default OrdersContent;
