import mongoose from "mongoose";

const courseUserSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    signUpPrice: {
        type: Number,
        required: true,
    }
},
    {
        timestamps: true,
    });

const CourseUser = mongoose.model("CourseUser", courseUserSchema);

export default CourseUser;