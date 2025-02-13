import jwt from "jsonwebtoken";
import userModel from "../model/user.model";

exports.userVerifyTOken = async (req, res, next) => {
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return res.status(401).json({ message: "Invalid Authorization" });           
        }
        const token  = authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "unauthorization: No Token Provided" });
        }
        const {userID} = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(userID);
        if (!user) {
            return res.status(401).json({ message: "Invalid User (token)" });         
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
    res.status(500).json({ message: "Internal Server Error" });
    }
}