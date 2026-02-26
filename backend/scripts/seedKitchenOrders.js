// backend/scripts/seedKitchenOrders.js
import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const seedKitchenOrders = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foodOrdering"
    );

    // Find chef user
    const chef = await User.findOne({ email: "chef@gmail.com" });
    if (!chef) {
      console.error("❌ Chef not found. Run seedChef.js first!");
      process.exit(1);
    }

    console.log("🔍 Found chef:", chef.email);
    console.log("📝 Chef ID:", chef._id);

    // Sample orders to create using real menu item IDs
    const testOrders = [
      {
        orderId: "ORD-001",
        customer: {
          name: "John Doe",
          email: "john@example.com",
          phone: "555-1234",
          address: "123 Main St, City",
          specialInstructions: "Extra spices, no onions",
        },
        items: [
          {
            menuItemId: "68c3e43d6ba1c424013577a2", // Chicken Biryani
            name: "Chicken Biryani",
            quantity: 2,
            price: 40,
          },
          {
            menuItemId: "68c440779f29d3ad38cd7cc3", // Fried Rice
            name: "Fried Rice",
            quantity: 1,
            price: 100,
          },
        ],
        total: 180,
        paymentMethod: "cod",
        status: "confirmed",
        chefId: chef._id,
      },
      {
        orderId: "ORD-002",
        customer: {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "555-5678",
          address: "456 Oak Ave, Town",
          specialInstructions: "Extra cheese on pasta",
        },
        items: [
          {
            menuItemId: "68c3f04dfe82d7370f0b2675", // Pasta
            name: "Pasta",
            quantity: 1,
            price: 25,
          },
          {
            menuItemId: "694e7b7fc3e752bf8600695c", // Pakora
            name: "Pakora",
            quantity: 2,
            price: 100,
          },
        ],
        total: 225,
        paymentMethod: "wallet",
        status: "assigned_to_kitchen",
        chefId: chef._id,
      },
      {
        orderId: "ORD-003",
        customer: {
          name: "Bob Wilson",
          email: "bob@example.com",
          phone: "555-9012",
          address: "789 Pine Rd, Village",
          specialInstructions: "Dal should be less spicy",
        },
        items: [
          {
            menuItemId: "6914a25b075a61b89f29024f", // Dal Bhat
            name: "Dal Bhat",
            quantity: 1,
            price: 30,
          },
          {
            menuItemId: "694e7b7fc3e752bf8600695c", // Pakora
            name: "Pakora",
            quantity: 1,
            price: 100,
          },
        ],
        total: 130,
        paymentMethod: "cod",
        status: "confirmed",
        chefId: chef._id,
      },
      {
        orderId: "ORD-004",
        customer: {
          name: "Alice Brown",
          email: "alice@example.com",
          phone: "555-3456",
          address: "321 Elm St, Metro",
          specialInstructions: "Make it hot and spicy",
        },
        items: [
          {
            menuItemId: "68c3e43d6ba1c424013577a2", // Chicken Biryani
            name: "Chicken Biryani",
            quantity: 1,
            price: 40,
          },
          {
            menuItemId: "68c3f04dfe82d7370f0b2675", // Pasta
            name: "Pasta",
            quantity: 1,
            price: 25,
          },
        ],
        total: 65,
        paymentMethod: "bank",
        status: "assigned_to_kitchen",
        chefId: chef._id,
      },
      {
        orderId: "ORD-005",
        customer: {
          name: "Charlie Davis",
          email: "charlie@example.com",
          phone: "555-7890",
          address: "654 Maple Dr, City",
          specialInstructions: "Mild spices please",
        },
        items: [
          {
            menuItemId: "68c440779f29d3ad38cd7cc3", // Fried Rice
            name: "Fried Rice",
            quantity: 3,
            price: 100,
          },
        ],
        total: 300,
        paymentMethod: "cod",
        status: "confirmed",
        chefId: chef._id,
      },
    ];

    // Clear existing orders for this chef
    await Order.deleteMany({ chefId: chef._id });
    console.log("🧹 Cleared previous orders");

    // Insert new orders
    const createdOrders = await Order.insertMany(testOrders);
    console.log(`\n✅ Created ${createdOrders.length} test orders!\n`);

    createdOrders.forEach((order, index) => {
      console.log(`📦 Order ${index + 1}: ${order.orderId}`);
      console.log(`   Customer: ${order.customer.name}`);
      console.log(`   Items: ${order.items.length}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Total: $${order.total}`);
    });

    console.log("\n🎉 Ready to test Kitchen Orders Dashboard!");
    console.log("📍 Go to: http://localhost:5173/kitchen/dashboard");
    console.log("👨‍🍳 Login with: chef@gmail.com / chef123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding orders:", error);
    process.exit(1);
  }
};

seedKitchenOrders();
