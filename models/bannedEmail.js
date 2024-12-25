import mongoose from "mongoose";

const bannedEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    }
});

const BannedEmail = mongoose.model("BannedEmail", bannedEmailSchema);

export default BannedEmail;