import React, { useEffect, useState } from "react";
import { Users, Search, Trash2, Ban, CheckCircle } from "lucide-react";
import api from "../../../services/api";

const CustomersContent = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch customers with optional search
  const fetchCustomers = async (search = "") => {
    try {
      setLoading(true);
      setError(null);
      // Pass search as query param
      const res = await api.get("/api/admin/users", {
        params: { search },
      });

      let customersData = [];
      if (Array.isArray(res.data)) {
        customersData = res.data;
      } else if (res.data.users && Array.isArray(res.data.users)) {
        customersData = res.data.users;
      } else if (res.data.data && Array.isArray(res.data.data)) {
        customersData = res.data.data;
      } else {
        console.warn("Unexpected API response format", res.data);
      }

      setCustomers(customersData);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError("Unable to load customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle search input change with debounce (optional)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Simple debounce: wait 500ms after last keystroke
    const timeoutId = setTimeout(() => {
      fetchCustomers(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  // Delete handler
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      // Remove from state
      setCustomers((prev) => prev.filter((c) => c._id !== userId && c.id !== userId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user.");
    }
  };

  // Block/Unblock handler
  const handleToggleBlock = async (userId, currentStatus) => {
    const action = currentStatus === "blocked" ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      // Assume endpoint expects userId and new status
      await api.patch(`/api/admin/users/${userId}/block`, {
        blocked: currentStatus !== "blocked", // toggle
      });
      // Update status in state
      setCustomers((prev) =>
        prev.map((c) =>
          c._id === userId || c.id === userId
            ? { ...c, status: currentStatus === "blocked" ? "active" : "blocked" }
            : c
        )
      );
    } catch (err) {
      console.error("Block/unblock failed:", err);
      alert("Failed to update user status.");
    }
  };

  // Helper to safely format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  // Loading state
  if (loading && customers.length === 0) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-gray-500">Loading customers...</div>
      </div>
    );
  }

  // Error state (only if no data)
  if (error && customers.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-800">
            Customer Management
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customers Table */}
      {customers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No customers found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((customer) => {
                const userId = customer._id || customer.id;
                const isBlocked = customer.status === "blocked";
                return (
                  <tr key={userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {customer.phone || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleBlock(userId, customer.status)}
                          className={`p-1 rounded hover:bg-gray-200 transition ${
                            isBlocked
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                          title={isBlocked ? "Unblock user" : "Block user"}
                        >
                          {isBlocked ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Ban className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(userId)}
                          className="p-1 text-red-600 rounded hover:bg-gray-200 transition"
                          title="Delete user"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomersContent;