import mongoose from "mongoose";

const bannedPhoneSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        unique: [true, 'Phone number already exists']
    },
});

const BannedPhone = mongoose.model("BannedPhone", bannedPhoneSchema);

export default BannedPhone;