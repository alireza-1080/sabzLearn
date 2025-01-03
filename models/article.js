import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    href: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true
    });

const Article = mongoose.model("Article", articleSchema);

export default Article;
