import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const ConnectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Mongodb connected successfully"))
    .catch((error) => console.log("Error connecting mongodb :", error));
};
