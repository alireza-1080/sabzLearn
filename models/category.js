import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Category title is required"],
        unique: [true, "Category title must be unique"],
    },
    href: {
        type: String,
        required: [true, "Category title is required"],
        unique: [true, "Category title must be unique"],
    },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;