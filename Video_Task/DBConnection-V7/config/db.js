import mongoose from "mongoose";
export const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connected Successfully...");
    } catch (error) {
        console.error("DB Is Not Connected...",error);
        process.exit(1);
    }
};