import { useEffect } from "react";
import useSocket from "../../../hooks/useSocket";

const useKitchenSocket = ({ setOrders }) => {
  const { isConnected, on } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    const updateOrderStatus = (orderId, status) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status } : order,
        ),
      );
    };

    const removeOrder = (orderId) => {
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    };

    const unsubConfirmed = on("order:confirmed", ({ orderId }) => {
      updateOrderStatus(orderId, "confirmed");
    });

    const unsubPreparing = on("order:preparing", ({ orderId }) => {
      updateOrderStatus(orderId, "preparing");
    });

    const unsubPrepared = on("order:prepared", ({ orderId }) => {
      removeOrder(orderId);
    });

    return () => {
      unsubConfirmed?.();
      unsubPreparing?.();
      unsubPrepared?.();
    };
  }, [isConnected, on, setOrders]);

  return {
    isConnected,
  };
};

export default useKitchenSocket;
