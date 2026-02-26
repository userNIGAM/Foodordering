import React, { useEffect, useState, useCallback } from 'react';
import { ChefHat } from 'lucide-react';
import useSocket from '../../hooks/useSocket';
import StatsCards from './components/StatsCards';
import OrdersTable from './components/OrdersTable';
import OrderDetailModal from './components/OrderDetailModal';
import IssueModal from './components/IssueModal';
import { getTimeAgo } from '../utils/timeAgo'; // if needed elsewhere

const KitchenOrders = () => {
  const { isConnected, on } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [filter, setFilter] = useState('assigned_to_kitchen');
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    preparing: 0,
    prepared: 0,
    issues: 0,
  });

  const token = localStorage.getItem('token');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5173';

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/chef/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
        calculateStats(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Listen for real-time updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribeOrderUpdate = on('orderUpdate', (updatedOrder) => {
      setOrders((prev) => {
        const newOrders = prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o));
        calculateStats(newOrders);
        return newOrders;
      });
    });

    const unsubscribeNewOrder = on('newOrderForChef', (newOrder) => {
      setOrders((prev) => {
        const newOrders = [newOrder, ...prev];
        calculateStats(newOrders);
        return newOrders;
      });
    });

    return () => {
      unsubscribeOrderUpdate?.();
      unsubscribeNewOrder?.();
    };
  }, [isConnected, on]);

  // Calculate stats
  const calculateStats = (orderList) => {
    setStats({
      total: orderList.length,
      confirmed: orderList.filter((o) => o.status === 'confirmed').length,
      preparing: orderList.filter((o) => o.status === 'preparing').length,
      prepared: orderList.filter((o) => o.status === 'prepared').length,
      issues: orderList.filter((o) => o.status === 'issue').length,
    });
  };

  // Filter orders based on status
  const getFilteredOrders = () => {
    switch (filter) {
      case 'confirmed':
        return orders.filter((o) => o.status === 'confirmed');
      case 'preparing':
        return orders.filter((o) => o.status === 'preparing');
      case 'prepared':
        return orders.filter((o) => o.status === 'prepared');
      case 'issue':
        return orders.filter((o) => o.status === 'issue');
      default:
        return orders.filter(
          (o) => o.status === 'confirmed' || o.status === 'preparing' || o.status === 'issue'
        );
    }
  };

  // API Handlers
  const handleStartPreparing = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/chef/order/${orderId}/start-preparing`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: 'Kitchen staff started preparation' }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrders((prev) => {
          const newOrders = prev.map((o) => (o._id === orderId ? data.data : o));
          calculateStats(newOrders);
          return newOrders;
        });
        setSelectedOrder(null);
      } else {
        alert('Failed to start preparation');
      }
    } catch (error) {
      console.error('Error starting preparation:', error);
      alert('Error starting preparation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsPrepared = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/chef/order/${orderId}/prepared`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: 'Order prepared and ready for delivery' }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrders((prev) => {
          const newOrders = prev.map((o) => (o._id === orderId ? data.data : o));
          calculateStats(newOrders);
          return newOrders;
        });
        setSelectedOrder(null);
      } else {
        alert('Failed to mark order as prepared');
      }
    } catch (error) {
      console.error('Error marking order as prepared:', error);
      alert('Error marking order as prepared');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReportIssue = async (orderId, issueDescription) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/chef/order/${orderId}/issue`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: issueDescription, issue: issueDescription }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrders((prev) => {
          const newOrders = prev.map((o) => (o._id === orderId ? data.data : o));
          calculateStats(newOrders);
          return newOrders;
        });
        setShowIssueModal(false);
        setSelectedOrder(null);
      } else {
        alert('Failed to report issue');
      }
    } catch (error) {
      console.error('Error reporting issue:', error);
      alert('Error reporting issue');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <ChefHat size={32} className="text-orange-600" />
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Kitchen Orders</h1>
            <p className="text-slate-600">Manage incoming orders and preparation status</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} filter={filter} onFilterChange={setFilter} />

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        actionLoading={actionLoading}
        onViewDetails={(order) => {
          setSelectedOrder(order);
          setShowDetailModal(true);
        }}
        onStartPreparing={handleStartPreparing}
        onMarkPrepared={handleMarkAsPrepared}
        onReportIssue={(order) => {
          setSelectedOrder(order);
          setShowIssueModal(true);
        }}
      />

      {/* Modals */}
      {showDetailModal && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowDetailModal(false)}
          onStartPreparing={handleStartPreparing}
          onMarkPrepared={handleMarkAsPrepared}
          actionLoading={actionLoading}
        />
      )}

      {showIssueModal && (
        <IssueModal
          order={selectedOrder}
          onClose={() => {
            setShowIssueModal(false);
            setSelectedOrder(null);
          }}
          onSubmit={handleReportIssue}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default KitchenOrders;