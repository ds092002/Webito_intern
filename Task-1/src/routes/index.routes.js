const usersRoutes = require('express').Router();
const userRoute = require('./user.routes');

usersRoutes.use('/user', userRoute);

module.exports = usersRoutes;