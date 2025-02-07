const UserService = require('../services/user.service');
const userService = new UserService();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');



// Register new users
exports.registerUser = async (req, res) => {
    try {
        console.log("Body Data ====> ", req.body);
        let user = await userService.getUser({email: req.body.email});
        if(user) {
            return res.status(400).json({message: `User already exists.`});
        }
        if (req.file) {
            console.log(req.file);
            req.body.profileImage = req.file.path.replace(/\\/g,"/")   
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

exports.forgetPassword = async (req, res) => {
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
