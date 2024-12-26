import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    isItFree: {
        type: Boolean,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }
},
    {
        timestamps: true
    }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;