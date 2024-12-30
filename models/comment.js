import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    rate: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5],
    },
    isItReply: {
        type: Boolean,
        required: true,
    },
    mainComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        validate: {
            validator: function (v) {
                return !this.isItReply || (this.isItReply && v != null);
            },
            message: "mainComment is required if isItReply is true"
        }
    },
},
    {
        timestamps: true
    });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;