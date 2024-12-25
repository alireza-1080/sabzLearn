import mongoose from "mongoose";

const bannedEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is a required field"],
        trim: true,
        unique: [true, "Email already exists"],
        lowercase: [true, "Email must be in lowercase"],
    }
});

const BannedEmail = mongoose.model("BannedEmail", bannedEmailSchema);

export default BannedEmail;