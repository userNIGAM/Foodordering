import { useState } from "react";
import useKitchens from "./hooks/useKitchens";
import useKitchenOrders from "./hooks/useKitchenOrders";
import useKitchenSocket from "./hooks/useKitchenSocket";

import KitchenHeader from "./components/KitchenHeader";
import KitchenSelector from "./components/KitchenSelector";
import KitchenStats from "./components/KitchenStats";
import OrderGrid from "./components/OrderGrid";

const KitchenDisplaySystem = () => {
  const [selectedKitchen, setSelectedKitchen] = useState(null);

  const { kitchens, loading } = useKitchens({
    onLoaded: (list) => {
      if (list.length > 0) {
        setSelectedKitchen(list[0]._id);
      }
    },
  });

  const { orders, stats, setOrders } = useKitchenOrders(selectedKitchen);

  const { isConnected } = useKitchenSocket({
    setOrders,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <div className="h-12 w-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-white bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <KitchenHeader isConnected={isConnected} />

      <KitchenSelector
        kitchens={kitchens}
        selectedKitchen={selectedKitchen}
        setSelectedKitchen={setSelectedKitchen}
      />

      <KitchenStats stats={stats} />

      <OrderGrid orders={orders} />
    </div>
  );
};

export default KitchenDisplaySystem;
