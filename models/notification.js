import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    message: {
        type: String,
        required: true
    },
    isSeen: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;