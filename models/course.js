import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Course title is required"],
        index: true,
    },
    description: {
        type: String,
        required: [true, "Course description is required"],
    },
    cover: {
        type: String,
        required: [true, "Course cover is required"],
    },
    duration: {
        type: String,
        required: [true, "Course duration is required"],
    },
    support: {
        type: String,
        required: [true, "Course support is required"],
    },
    price: {
        type: Number,
        required: [true, "Course price is required"],
        min: [0, "Course price must be a positive number"],
    },
    href: {
        type: String,
        required: [true, "Course href is required"],
    },
    status: {
        type: String,
        required: [true, "Course status is required"],
        enum: {
            values: ["completed", "recording", "pre-sale"],
            message: "Course status must be one of completed, recording, or pre-sale",
        },
        default: "pre-sale",
    },
    discount: {
        type: Number,
        required: [true, "Course discount is required"],
        min: [0, "Course discount must be a positive number"],
        max: [100, "Course discount cannot exceed 100"],
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Course category is required"],
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Course instructor is required"],
    },
}, {
    timestamps: true
});

//^ Create virtual field for course sessions
courseSchema.virtual("sessions", {
    ref: "Session",
    localField: "_id",
    foreignField: "course",
    justOne: false,
});

//^ Create virtual field for course comments
courseSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "course",
    justOne: false,
});

const Course = mongoose.model("Course", courseSchema);

export default Course;