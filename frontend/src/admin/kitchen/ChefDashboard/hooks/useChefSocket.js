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

    return () => {
      unsubscribe?.();
    };
  }, [isConnected, on, setOrders]);

  return {
    isConnected,
  };
};

export default useChefSocket;
