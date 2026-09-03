import OrderRow from "./OrderRow";

const OrdersTable = ({
  orders,
  actionLoading,
  onConfirm,
  onStartPreparing,
  onMarkPrepared,
  onReportIssue,
}) => {
  return (
    <div className="card">
      <div className="card-header bg-light">
        <h5 className="mb-0">📋 Assigned Orders</h5>
      </div>

      <div className="card-body">
        {orders.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No orders assigned yet</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <OrderRow
                    key={order._id}
                    order={order}
                    actionLoading={actionLoading}
                    onConfirm={onConfirm}
                    onStartPreparing={onStartPreparing}
                    onMarkPrepared={onMarkPrepared}
                    onReportIssue={onReportIssue}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
