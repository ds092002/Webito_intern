import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`DB is connected..`);
    } catch (error) {
        console.log(`Error connecting to Mongo`, error.message);
        process.exit(1);                
    }
}