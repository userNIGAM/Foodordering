import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChevronDown, ChevronUp, Package, Clock, CheckCircle, AlertCircle } from "lucide-react";

const UserOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-blue-100 text-blue-800",
      assigned_to_kitchen: "bg-purple-100 text-purple-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      prepared: "bg-green-100 text-green-800",
      assigned_to_delivery: "bg-indigo-100 text-indigo-800",
      picked_up: "bg-cyan-100 text-cyan-800",
      out_for_delivery: "bg-sky-100 text-sky-800",
      delivered: "bg-green-100 text-green-800",
      issue: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    if (status === "delivered") return <CheckCircle className="w-4 h-4" />;
    if (status === "issue") return <AlertCircle className="w-4 h-4" />;
    if (status === "preparing" || status === "out_for_delivery")
      return <Clock className="w-4 h-4 animate-spin" />;
    return <Package className="w-4 h-4" />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
        <div className="flex items-center gap-3 p-5 bg-red-50 border-l-4 border-red-400 rounded text-red-700 font-semibold">
          <AlertCircle className="w-6 h-6" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50 py-10 px-5">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Orders</h1>
        <p className="text-slate-600">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="max-w-3xl mx-auto text-center py-20">
          <Package className="w-16 h-16 text-slate-300 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Orders Yet</h2>
          <p className="text-slate-600 mb-6">Start ordering delicious food from our menu!</p>
          <a
            href="/menu"
            className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Browse Menu
          </a>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Order Header */}
              <div
                className="flex justify-between items-center gap-4 p-6 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                onClick={() => toggleExpand(order._id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-slate-900">{order.orderId}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <span className="flex items-center justify-center">{getStatusIcon(order.status)}</span>
                      {order.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{formatDate(order.createdAt)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm text-slate-600">Rs.</span>
                    <span className="text-2xl font-bold text-red-600"> {order.total}</span>
                  </div>
                  <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
                    {expandedOrderId === order._id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Order Details - Expanded */}
              {expandedOrderId === order._id && (
                <div className="border-t border-slate-200 py-6 px-6 space-y-6 animate-in fade-in duration-300">
                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-bold uppercase text-slate-600 mb-4 tracking-wide">
                      Customer Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase text-slate-500">Name</span>
                        <p className="text-slate-900">{order.customer.name}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase text-slate-500">Email</span>
                        <p className="text-slate-900">{order.customer.email}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase text-slate-500">Phone</span>
                        <p className="text-slate-900">{order.customer.phone}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase text-slate-500">
                          Payment Method
                        </span>
                        <p className="text-slate-900">
                          {order.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-xs font-bold uppercase text-slate-500">Address</span>
                        <p className="text-slate-900">{order.customer.address}</p>
                      </div>
                      {order.customer.specialInstructions && (
                        <div className="sm:col-span-2">
                          <span className="text-xs font-bold uppercase text-slate-500">
                            Special Instructions
                          </span>
                          <p className="text-slate-900">{order.customer.specialInstructions}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm font-bold uppercase text-slate-600 mb-4 tracking-wide">
                      Order Items
                    </h4>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 gap-3 bg-slate-100 p-4 font-bold text-xs text-slate-700 uppercase">
                        <div>Item</div>
                        <div className="text-center">Qty</div>
                        <div className="text-right">Price</div>
                        <div className="text-right">Total</div>
                      </div>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-4 gap-3 p-4 border-t border-slate-200 text-sm">
                          <div className="text-slate-900 font-medium">{item.name}</div>
                          <div className="text-center text-slate-700">{item.quantity}</div>
                          <div className="text-right text-slate-700">Rs. {item.price}</div>
                          <div className="text-right font-semibold text-slate-900">
                            Rs. {item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                      <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 border-t-2 border-slate-200 font-bold">
                        <div className="col-span-3 text-slate-900">Order Total</div>
                        <div className="text-right text-red-600">Rs. {order.total}</div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Ratings */}
                  <div>
                    <h4 className="text-sm font-bold uppercase text-slate-600 mb-4 tracking-wide">
                      Order Status
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase text-slate-500">Current Status</span>
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm mt-2 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.replace(/_/g, " ").toUpperCase()}
                        </div>
                      </div>
                      {order.deliveryRating && (
                        <div>
                          <span className="text-xs font-bold uppercase text-slate-500">
                            Delivery Rating
                          </span>
                          <p className="text-lg mt-2">{"⭐".repeat(order.deliveryRating)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Issue Tracking */}
                  {order.issue && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                      <h4 className="text-sm font-bold uppercase text-slate-600 mb-3 tracking-wide">
                        Issue Reported
                      </h4>
                      <p className="text-slate-900 mb-3">{order.issue.description}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-bold text-white ${
                          order.issue.status === "open" ? "bg-red-600" : "bg-green-600"
                        }`}
                      >
                        {order.issue.status.toUpperCase()}
                      </span>
                      {order.issue.resolution && (
                        <p className="text-slate-700 mt-3">
                          <strong>Resolution:</strong> {order.issue.resolution}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
