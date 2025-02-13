import express from "express";
import usersRoutes from "../routes/userRoute.js";

const userRoute = express.Router();

//User Route
userRoute.use("/users", usersRoutes);

export default userRoute;
