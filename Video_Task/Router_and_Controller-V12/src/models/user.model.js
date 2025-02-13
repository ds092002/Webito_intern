const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10}$/
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    resetOTP: {
        type: String,
        required: false,
    },
      otpExpires: {
        type: Date,
        required: false,
    },  
    isDelete: {
        type: Boolean,
        default: false
    }
},
{
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('User',userSchema);