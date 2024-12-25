import mongoose from "mongoose";

const bannedPhoneSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
});

const BannedPhone = mongoose.model("BannedPhone", bannedPhoneSchema);

export default BannedPhone;