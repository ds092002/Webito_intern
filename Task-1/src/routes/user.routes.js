const userRoute = require('express').Router();
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    changePassword
} = require('../controller/user.controller')
const { userVerifyToken } = require('../helpers/userVerifyToken');

userRoute.post('/register-User', registerUser);
userRoute.post('/login-User', loginUser);
usersRoutes.put("/changePassword", changePassword);
usersRoutes.post("/forgotPassword", forgotPassword);
usersRoutes.post("/resetPassword", resetPassword);


module.exports = userRoute;