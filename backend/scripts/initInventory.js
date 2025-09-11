import mongoose from "mongoose";
import Inventory from "../models/Inventory.js";
import MenuItem from "../models/MenuItem.js";
import dotenv from "dotenv";

dotenv.config();

const initInventory = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get all menu items
    const menuItems = await MenuItem.find();
    console.log(`Found ${menuItems.length} menu items`);

    // Create inventory entries for each menu item
    for (const item of menuItems) {
      const existingInventory = await Inventory.findOne({
        menuItemId: item._id,
      });

      if (!existingInventory) {
        const inventory = new Inventory({
          menuItemId: item._id,
          currentStock: Math.floor(Math.random() * 100) + 20, // Random stock between 20-120
          lowStockThreshold: 10,
          unit: "units",
          costPerUnit: item.price * 0.3, // 30% of selling price as cost
        });

        await inventory.save();
        console.log(`Created inventory for: ${item.name}`);
      }
    }

    console.log("Inventory initialization completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing inventory:", error);
    process.exit(1);
  }
};

initInventory();
