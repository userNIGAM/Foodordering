// // backend/scripts/seedAdmin.js
// import mongoose from "mongoose";
// import User from "../models/User.js";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// dotenv.config();

// const seedAdmin = async () => {
//   try {
//     await mongoose.connect(
//       process.env.MONGODB_URI || "mongodb://localhost:27017/foodOrdering"
//     );

//     const adminExists = await User.findOne({ email: "admin@example.com" });

//     if (!adminExists) {
//       // Hash the password
//       const saltRounds = 12;
//       const hashedPassword = await bcrypt.hash("admin123", saltRounds);

//       const adminUser = new User({
//         name: "Admin User",
//         email: "admin@example.com",
//         password: hashedPassword,
//         role: "admin",
//       });

//       await adminUser.save();
//       console.log("✅ Admin user created successfully");
//       console.log("📧 Email: admin@example.com");
//       console.log("🔑 Password: admin123");
//     } else {
//       console.log("ℹ️ Admin user already exists");
//       console.log("📧 Email: admin@example.com");
//       console.log("🔑 If you forgot the password, reset it in the database");
//     }

//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Error seeding admin:", error);
//     process.exit(1);
//   }
// };

// seedAdmin();
