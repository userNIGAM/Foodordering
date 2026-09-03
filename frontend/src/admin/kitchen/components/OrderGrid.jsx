import OrderCard from "./OrderCard";
import EmptyOrders from "./EmptyOrders";

const OrderGrid = ({ orders }) => {
  return (
    <div className="flex-1 overflow-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-cyan-400/60 [&::-webkit-scrollbar-thumb]:rounded-full">
      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderGrid;
