import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    isItReplied: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

export default ContactUs;