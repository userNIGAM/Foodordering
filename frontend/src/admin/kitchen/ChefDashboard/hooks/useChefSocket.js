import { useEffect } from "react";
import useSocket from "../../../../hooks/useSocket";

const useChefSocket = ({ setOrders }) => {
  const { isConnected, on } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = on("order:confirmed", ({ orderId }) => {
      console.log("Order confirmed:", orderId);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: "confirmed",
              }
            : order,
        ),
      );
    });

    const unsubscribeStatus = on("order:status_changed", (updatedOrder) => {
      const orderId = updatedOrder._id || updatedOrder.orderId;
      if (!orderId) return;
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, ...updatedOrder, _id: order._id }
            : order,
        ),
      );
    });

    const unsubscribeAssigned = on("order:assigned", ({ orderData, orderId }) => {
      if (!orderData && !orderId) return;
      const assignedOrder = {
        ...(orderData || {}),
        _id: orderData?._id || orderId,
        status: "assigned_to_kitchen",
      };
      setOrders((prev) =>
        prev.some((order) => order._id === assignedOrder._id)
          ? prev
          : [assignedOrder, ...prev],
      );
    });

    return () => {
      unsubscribe?.();
      unsubscribeStatus?.();
      unsubscribeAssigned?.();
    };
  }, [isConnected, on, setOrders]);

  return {
    isConnected,
  };
};

export default useChefSocket;
