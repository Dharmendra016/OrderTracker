import mongoose from "mongoose";
import { config } from "./config";


export const connectDB = async () => {
    try {
        await mongoose.connect(config.db_string as string)
        console.log("Database connected successfully");

    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the process with failure
    }
}