import OrderItems from "./OrderItems";
import { getRemainingTime, getOrderStatusLabel } from "../utils/orderHelpers";
import { getOrderStyles } from "../utils/orderStyles";

const OrderCard = ({ order }) => {
  const remainingTime = getRemainingTime(
    order.createdAt,
    order.estimatedPrepTime,
  );

  return (
    <div
      className={`bg-white/10 border-4 rounded-xl flex flex-col transition hover:-translate-y-2 duration-300 ${getOrderStyles(
        order.status,
      )}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 flex justify-between items-center border-b border-cyan-400/40">
        <div className="text-2xl font-bold text-cyan-400">#{order.orderId}</div>

        <div className="bg-cyan-400/20 px-3 py-1 rounded-full text-sm border border-cyan-400">
          {getOrderStatusLabel(order.status)}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1">
        <div className="font-semibold mb-4">
          👤 {order.customer?.name || "Unknown"}
        </div>

        <OrderItems items={order.items} />

        {order.specialInstructions && (
          <div className="bg-orange-500/10 border-l-4 border-orange-500 p-3 rounded text-orange-300 text-sm italic">
            📝 {order.specialInstructions}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-cyan-400/40 bg-black/20">
        <div className="text-lg font-bold text-cyan-400 mb-2">
          ⏱️ {remainingTime} min
        </div>

        {order.status === "preparing" && (
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-1000"
              style={{
                width: `${Math.min(
                  100,
                  (remainingTime / (order.estimatedPrepTime || 30)) * 100,
                )}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
