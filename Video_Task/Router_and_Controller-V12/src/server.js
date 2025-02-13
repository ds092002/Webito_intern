import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";

dotenv.config();

const port = process.env.PORT;
const app = express();

// Middleware
app.use(express.json());


// Connect to Database
connectDB();

// Server Connection
app.listen(port, () => {
  console.log(`Server Start At Port http://localhost:${port}`);
});
