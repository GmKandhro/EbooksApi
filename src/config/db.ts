import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Mongodb database is connected successful");
        });
        mongoose.connection.on("error", () => {
            console.log("Something went wrong while connecting db");
        });
        await mongoose.connect(config.mongodbUrl as string);
    } catch (error) {
        console.error(`The mongodb connection failed due to ${error}`);
        process.exit(1);
    }
};

export { connectDB };
