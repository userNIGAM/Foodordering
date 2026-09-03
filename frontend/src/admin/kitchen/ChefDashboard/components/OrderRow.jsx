import OrderActions from "./OrderActions";
import { getStatusColor, getStatusLabel } from "../utils/orderStatus";

const OrderRow = ({
  order,
  actionLoading,
  onConfirm,
  onStartPreparing,
  onMarkPrepared,
  onReportIssue,
}) => {
  return (
    <tr>
      <td>
        <strong>{order.orderId}</strong>
      </td>

      <td>{order.customer?.name || "N/A"}</td>

      <td>
        <small>{order.items?.length || 0} items</small>
      </td>

      <td>
        <span className={`badge ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </td>

      <td>
        <OrderActions
          order={order}
          actionLoading={actionLoading}
          onConfirm={onConfirm}
          onStartPreparing={onStartPreparing}
          onMarkPrepared={onMarkPrepared}
          onReportIssue={onReportIssue}
        />
      </td>
    </tr>
  );
};

export default OrderRow;
