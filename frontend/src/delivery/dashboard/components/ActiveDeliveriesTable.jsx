import DeliveryActions from "./DeliveryActions";
import { getStatusColor } from "../utils/statusColors";

const ActiveDeliveriesTable = ({ deliveries, actions }) => {
  if (deliveries.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No active deliveries
      </p>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl mb-6">

      {/* Header */}
      <div className="border-b px-6 py-4">
        <h5 className="text-lg font-semibold flex items-center gap-2">
          📦 Active Deliveries
        </h5>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="min-w-full text-sm text-left">

          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {deliveries.map((delivery) => (
              <tr
                key={delivery._id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">
                  {delivery.orderId}
                </td>

                <td className="px-6 py-4">
                  {delivery.customer?.name}
                </td>

                <td className="px-6 py-4">
                  {delivery.customer?.address}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      delivery.status
                    )}`}
                  >
                    {delivery.status}
                  </span>
                </td>

                <td className="px-6 py-4 font-medium">
                  ₹{delivery.total}
                </td>

                <td className="px-6 py-4">
                  <DeliveryActions delivery={delivery} actions={actions} />
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
};

export default ActiveDeliveriesTable;