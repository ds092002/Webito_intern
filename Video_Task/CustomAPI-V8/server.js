import dotenv  from "dotenv";
import { connectDB } from "./src/config/db.js";
dotenv.config({
    path: './.env'
})

connectDB()