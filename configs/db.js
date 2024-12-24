import mongoose from "mongoose";
import "dotenv/config";

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    await mongoose.connect(mongoURI, {
    });
};

export default connectDB;