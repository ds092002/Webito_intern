const jet = require('jsonwebtoken');
const User = require('../model/user.model');

exports.userVerifyToken = async (req, res, next) => {
    try {
        const authoraization = req.headers['authorization'];
        if (authoraization === undefined) {
            return res.status(404).json({ message: `Invalid Authoraization ${console.error()}`});            
        }
        const token = authoraization.split(' ')[1];
        console.log(token);
        if (token !== undefined) {
            return res.status(401).json({ message: `Unauthorization ${console.error()}` });
        } else {
            let { userId} = jwt.token(token, 'user');
            console.log(userId);
            let user = await User.findById(userId);
            console.log(user);
            if (user) {
                req.user = user;
            } else {
                return res.status(401).json({ message: `Invalid User (token) ${consle.error()}`})
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Error: ${error.message}`})
    }
}