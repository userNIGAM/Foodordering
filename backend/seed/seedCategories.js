// backend/seedCategories.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import ConnectDB from "../config/db.js";

dotenv.config();
ConnectDB();

const categories = [
  // Main categories
  { name: "Rice" },
  { name: "Fast Food" },
  { name: "Lunch" },
  { name: "Dinner" },
  { name: "Breakfast" },
  { name: "Cold Drinks" },
  { name: "Beverages" },
  { name: "Snacks" },
  { name: "Desserts" },

  // Subcategories/examples
  { name: "Fried Rice", parent: "Rice" },
  { name: "Biryani", parent: "Rice" },
  { name: "Dal Bhat", parent: "Rice" },
  { name: "Pizza", parent: "Fast Food" },
  { name: "Burger", parent: "Fast Food" },
  { name: "Sandwich", parent: "Fast Food" },
  { name: "Pasta", parent: "Fast Food" },
  { name: "Tea", parent: "Beverages" },
  { name: "Coffee", parent: "Beverages" },
  { name: "Juice", parent: "Cold Drinks" },
  { name: "Milkshake", parent: "Cold Drinks" },
  { name: "Pancakes", parent: "Breakfast" },
  { name: "Omelette", parent: "Breakfast" },
  { name: "Chapati", parent: "Lunch" },
  { name: "Curry", parent: "Dinner" },
  { name: "Ice Cream", parent: "Desserts" },
  { name: "Cake", parent: "Desserts" },
];

const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log("Existing categories cleared.");

    // Insert new categories
    await Category.insertMany(categories);
    console.log("Categories seeded successfully!");

    process.exit();
  } catch (err) {
    console.error("Error seeding categories:", err);
    process.exit(1);
  }
};

seedCategories();
