import mongoose from "mongoose";

const draftSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true
    });

const Draft = mongoose.model("Draft", draftSchema);

export default Draft;