import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: [true, "Username already exists"],
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already exists"],
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: [true, "Phone number already exists"],
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
},
    {
        timestamps: true,
    });

const User = mongoose.model("User", userSchema);

export default User;