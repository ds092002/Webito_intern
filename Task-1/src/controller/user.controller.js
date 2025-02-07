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

exports.forgetPassword = async(req, res) => {
    try {
        let user = await userService.getUserById(req.user._id);
        if(!user){
            return res.json({ message: `User Not Found...Please try Again...`});
        }
        let comparePassword = await bcryptjs.compare(
            req.body.oldPassword, 
            user.password
        );
        if (!comparePassword) {
            return res.json({ message: `Old Password is not Match.. Please Try Again.`});
        }
        if(req.body.newPassword === req.body.oldPassword){
            return res.json({ message: `Old Password And New Password Are Same Plase Enter Diffrent Password..`});
        }
        if(req.body.newPassword !== req.body.confirmPassword){
            return res.json({ message: `New Password And Confirm Password is not Same.. Please Try Again.`});
        }
        let hashPassword = await bcryptjs.hash(req.body.newPassword, 10);
        user = await userService.updateUser(req.user._id, {password: hashPassword});
        res.status(200).json({user, message: 'Password changed successfully.....👍🏻' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error..${console.error()}`});
    }
};
