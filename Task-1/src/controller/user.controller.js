const UserService = require('../services/user.service');
const userService = new UserService();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
import { ThrowError } from '../utils/ErrorUtils.js';



// generate 6 digit otp
const generateOTP = () => {
    Math.floor(100000 + Math.random() * 900000).toString();
}

// Register new users
exports.registerUser = async (req, res) => {
    try {
        console.log("Body Data ====> ", req.body);
        let user = await userService.getUser({email: req.body.email});
        if(user) {
            return res.status(400).json({message: `User already exists.`});
        }
        let hashPassword =  await bcryptjs.hash(req.body.password, 10);
        console.log(hashPassword);
        user = await userService.addNewUser({
            ...req.body,
            password: hashPassword
        })
        res.status(201).json({message: 'User register successfully..', user: user})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error...${console.error()}`});
    }
}

exports.loginUser =  async (req, res) => {
    try {
        let user = await userService.getUser({email: req.body.email, isDelete: false});
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: `Email not found..please check your email address..`})
        }
        let checkPassword =  await bcryptjs.compare(req.body.password, user.password);
        if (!checkPassword) {
            return res.status(400).json({ message: `Password is not match please enter correct password...`});
        }
        let token = jwt.sign({ userId: user._id}, 'User');
        console.log(token);
        res.status(200).json({token, message: `Login SuccesFully..👍🏻`})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error...${console.error()}`});
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const {email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Provide Email Id" });
        }
        const user = await userService.getUserByEmail(email)
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        if (!(user instanceof mongoose.Model)) {
            return res.status(500).json({ message: "Invalid user data" });
        }

        const otp = generateOTP();
        user.resetOTP = otp;
        user.otpExpires = Data.now() + 10 * 60 * 1000;

        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_gmail_id',
                pass: 'your_gmail_password'
            }
        });

        const mailOptions = {
            from: 'your_gmail_id',
            to: email,
            subject: 'Reset Password',
            text: `Your OTP is: ${otp} it is valid for 10 minutes`
        };

        await transporter.sendMail(mailOptions);
        return res
      .status(200)
      .json({ message: "OTP sent successfully to your email." });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const {email, password, otp} = req.body;
        if (!email ||!password ||!otp) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        if (user.resetOTP !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        user.password = await bcryptjs.hash(password, 10);
        user.resetOTP = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign(
            {userId: user._id, email: user.email, isAdmin: user.isAdmin},
            process.env.JWT_SECRET,
            { expiresIn: "7d"})

        return res.status(200).json({message: "Password reset successfully.",user: { id: user._id, email: user.email, isAdmin: user.isAdmin },
    });    
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
}
exports.changePassword = async (req, res) => {
    try {
        let { oldPassword, newPassword, confirmPassword } = req.body;

        let user = await userService.getUserById(req.query.userId);
        if (!user) {
            return res.json({ message: 'User Not Found. Please Try Again.' });
        }

        let comparePassword = await bcryptjs.compare(oldPassword, newPassword);
        if (!comparePassword) {
            return res.status(404).json({ message: 'Incorrect Current Password.' });
        }

        if (newPassword === oldPassword) {
            return res.json({ message: 'Old Password And New Password Are Same. Please Enter a Different Password.' });
        }

        if (newPassword !== confirmPassword) {
            return res.json({ message: 'New Password And Confirm Password Do Not Match.' });
        }

        let hashPassword = await bcryptjs.hash(newPassword, 10);
        user = await userService.updateUser(user._id, { password: hashPassword });

        res.status(200).json({ user, message: 'Password Update Successful.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};
