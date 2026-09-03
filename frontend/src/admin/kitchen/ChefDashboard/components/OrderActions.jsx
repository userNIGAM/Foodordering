const OrderActions = ({
  order,
  actionLoading,
  onConfirm,
  onStartPreparing,
  onMarkPrepared,
  onReportIssue,
}) => {
  const renderAction = () => {
    switch (order.status) {
      case "assigned_to_kitchen":
        return (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onConfirm(order._id)}
            disabled={actionLoading}
          >
            {actionLoading ? "..." : "Confirm"}
          </button>
        );

      case "confirmed":
        return (
          <button
            className="btn btn-sm btn-warning"
            onClick={() => onStartPreparing(order._id)}
            disabled={actionLoading}
          >
            {actionLoading ? "..." : "Start Preparing"}
          </button>
        );

      case "preparing":
        return (
          <button
            className="btn btn-sm btn-success"
            onClick={() => onMarkPrepared(order._id)}
            disabled={actionLoading}
          >
            {actionLoading ? "..." : "Mark Prepared"}
          </button>
        );

      default:
        return <span className="text-muted">No actions</span>;
    }
  };

  return (
    <div className="btn-group btn-group-sm">
      {renderAction()}

      {order.status !== "prepared" && (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onReportIssue(order._id)}
          disabled={actionLoading}
        >
          ⚠️ Issue
        </button>
      )}
    </div>
  );
};

export default OrderActions;
