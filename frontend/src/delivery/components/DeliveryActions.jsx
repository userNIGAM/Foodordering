const DeliveryActions = ({ delivery, actions }) => {
  switch (delivery.status) {

    case "assigned_to_delivery":
      return (
        <button
          onClick={() => actions.pickupOrder(delivery._id)}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
        >
          📦 Pickup
        </button>
      );

    case "picked_up":
      return (
        <button
          onClick={() => actions.markInTransit(delivery._id)}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          🚗 In Transit
        </button>
      );

    case "out_for_delivery":
      return (
        <div className="flex gap-2">
          <button
            onClick={() => actions.deliverOrder(delivery._id)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            ✅ Delivered
          </button>

          <button
            onClick={() => actions.openLocation(delivery._id)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
          >
            📍 Update
          </button>
        </div>
      );

    default:
      return (
        <span className="text-gray-400 text-sm">
          No actions
        </span>
      );
  }
};

export default DeliveryActions;