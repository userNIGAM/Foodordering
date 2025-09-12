// clearDatabase.js
import dotenv from "dotenv";
import ConnectDB from "../config/db.js";
import MenuItem from "../models/MenuItem.js";

dotenv.config();

const clearData = async () => {
  try {
    await ConnectDB();
    await MenuItem.deleteMany();
    console.log("✅ Menu items deleted!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

clearData();
