import mongoose from "mongoose";

const newsletterSubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
},
    {
        timestamps: true
    });

const NewsletterSubscriber = mongoose.model("NewsletterSubscribers", newsletterSubscriberSchema);

export default NewsletterSubscriber;