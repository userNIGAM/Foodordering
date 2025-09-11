import Inventory from "../models/Inventory.js";

export const updateInventoryOnOrder = async (order) => {
  try {
    for (const item of order.items) {
      // Find the inventory item
      const inventoryItem = await Inventory.findOne({
        menuItemId: item.menuItemId,
      });

      if (inventoryItem && inventoryItem.isTracked) {
        // Reduce stock by the quantity ordered
        inventoryItem.currentStock = Math.max(
          0,
          inventoryItem.currentStock - item.quantity
        );
        inventoryItem.updatedAt = new Date();
        await inventoryItem.save();
      }
    }
  } catch (error) {
    console.error("Error updating inventory for order:", error);
    // Don't throw error to not interrupt order processing
  }
};

// Add this to your order controller after order is created
// import { updateInventoryOnOrder } from "../middleware/inventoryMiddleware.js";
// Then call: await updateInventoryOnOrder(order);
