import UserServices from "../services/userServices.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { ThrowError } from "../utils/ErrorUtils.js";

const userServices = new UserServices();

// Register User
export const registerUser = async (req, res) => {
  try {
    let user = await userServices.getUser({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User is already registered." });
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    user = await userServices.addNewUser({
      ...req.body,
      password: hashPassword,
    });

    res.status(201).json({ user, message: "New user added successfully." });
  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    let user = await userServices.getUser({
      email: req.body.email,
      isDelete: false,
    });
    if (!user) {
      return res.status(400).json({
        message: ` Email Not Found..Please Check Your Email Address.`,
      });
    }
    let chekPassword = await bcrypt.compare(req.body.password, user.password);
    if (!chekPassword) {
      return res
        .status(401)
        .json({
          message: ` Password is Not Match Please Enter Correct Password..`,
        });
    }
    let token = jwt.sign({ userId: user._id }, "User");
    console.log(token);
    res.status(200).json({ token, message: `Login SuccesFully..` });
  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { userId } = req.query;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required." });
    }
    let user = await userServices.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }
    if (newPassword === oldPassword) {
      return res
        .status(400)
        .json({ message: "New password can not be the same as old password." });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await userServices.updateUser(userId, { password: hashPassword });

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Provide Email Id" });
    }
    const chekUser = await userServices.getUserByEmail({ email });
    if (!chekUser) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });
    const receiver = {
      from: "vijaydankhara111@gmail.com",
      to: email,
      subject: "Password Reser Reqquest",
      text: `Click To Reset Your Password.${process.env.CLIENT_URL}/forgotPassword${token}`,
    };
    await transporter.sendMail(receiver);
    return res
      .status(200)
      .json({
        message:
          "Password Forgot Link Send Successfully Send Your Email Account",
      });
  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Please Provide Password." });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    let user = await userServices.getUser({ email: decode.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};
