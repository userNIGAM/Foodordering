import { useState } from "react";

import useChefDashboard from "./hooks/useChefDashboard";
import useChefOrders from "./hooks/useChefOrders";
import useChefSocket from "./hooks/useChefSocket";

import ChefHeader from "./components/ChefHeader";
import ChefStats from "./components/ChefStats";
import OrdersTable from "./components/OrdersTable";
import IssueModal from "./components/IssueModal";

const ChefDashboard = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const { chef, stats, loading } = useChefDashboard();

  const {
    orders,
    setOrders,
    actionLoading,
    confirmOrder,
    startPreparing,
    markPrepared,
    reportIssue,
  } = useChefOrders();

  const { isConnected } = useChefSocket({
    setOrders,
  });

  const openIssueModal = (orderId) => {
    setSelectedOrder(orderId);
    setShowIssueModal(true);
  };

  const closeIssueModal = () => {
    setSelectedOrder(null);
    setShowIssueModal(false);
  };

  if (loading) {
    return (
      <div className="chef-dashboard">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chef-dashboard">
      <div className="container-fluid py-4">
        <ChefHeader chef={chef} isConnected={isConnected} />

        <ChefStats stats={stats} />

        <OrdersTable
          orders={orders}
          actionLoading={actionLoading}
          onConfirm={confirmOrder}
          onStartPreparing={startPreparing}
          onMarkPrepared={markPrepared}
          onReportIssue={openIssueModal}
        />
      </div>

      {showIssueModal && (
        <IssueModal
          orderId={selectedOrder}
          actionLoading={actionLoading}
          onReport={reportIssue}
          onClose={closeIssueModal}
        />
      )}
    </div>
  );
};

export default ChefDashboard;
