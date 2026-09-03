import DeliveryActions from "./DeliveryActions";

const ActiveDeliveriesTable = ({ deliveries, actions }) => {

  return (
    <section className="mb-6 bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-5 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Active Deliveries</h2>
      </div>
      {deliveries.length === 0 ? (
        <p className="px-5 py-8 text-center text-gray-500">No active deliveries.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Pickup</th><th className="px-5 py-3">Deliver to</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Action</th></tr>
            </thead>
            <tbody className="divide-y">
              {deliveries.map((delivery) => (
                <tr key={delivery._id}>
                  <td className="px-5 py-4 font-medium">{delivery.orderId || delivery._id}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium">{delivery.kitchenId?.name || "Kitchen"}</div>
                    <div className="text-xs text-gray-500">{delivery.kitchenId?.location || delivery.kitchenId?.address?.city || "Pickup address unavailable"}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium">{delivery.customer?.name || "-"}</div>
                    <div className="text-xs text-gray-500">{delivery.customer?.address || "Delivery address unavailable"}</div>
                  </td>
                  <td className="px-5 py-4">{delivery.status.replaceAll("_", " ")}</td>
                  <td className="px-5 py-4"><DeliveryActions delivery={delivery} actions={actions} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ActiveDeliveriesTable;
