import mongoose from "mongoose";
export const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("DB Is Connected...");
    } catch (error) {
        console.error("DB Is Not Connected...",error);
        process.exit(1);
    }
};