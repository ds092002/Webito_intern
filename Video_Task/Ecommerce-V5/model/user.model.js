import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        }
    },
    {
        timestamps: true,
        versionKey: false
    });

    export const User = mongoose.model("User", userSchema);