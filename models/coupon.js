import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    percentage: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    maxRedemptions: {
        type: Number,
        required: true,
        min: 1
    },
    currentRedemptions: {
        type: Number,
        default: 0
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
    {
        timestamps: true
    });

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;