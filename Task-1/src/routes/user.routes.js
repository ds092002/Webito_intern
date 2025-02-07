const userRoute = require('express').Router();
const {
    registerUser,
    loginUser,
    forgetPassword
} = require('../controller/user.controller');
const { userVerifyToken } = require('../helpers/userVerifyToken');
const { upload } = require('../helpers/imageUpload');

userRoute.post('/register-User', upload.single('profileImage'), registerUser);
userRoute.post('/login-User', loginUser);
userRoute.put('/forget-password', userVerifyToken,forgetPassword)

module.exports = userRoute;