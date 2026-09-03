import OrdersTableRow from "./OrdersTableRow";

export default function OrdersTable({ orders, formatDate, totalAmount }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Items
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <OrdersTableRow
              key={order.id}
              order={order}
              formatDate={formatDate}
            />
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td
              colSpan="2"
              className="px-6 py-4 text-sm font-semibold text-right text-gray-700"
            >
              Total Amount:
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
              ${totalAmount.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
