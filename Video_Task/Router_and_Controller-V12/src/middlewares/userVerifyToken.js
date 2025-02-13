import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

exports.userVerifyToken = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return res.status(401).json({ message: "Invalid Authorization" });
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "unauthorization: No Token Provided" });
    }
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid User (token)" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
