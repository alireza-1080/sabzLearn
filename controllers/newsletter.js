import NewsletterSubscriber from '../models/newsletterSubscriber.js';
import emailValidator from '../validators/emailValidator.js';

const createNewsletterSubscriber = async (req, res) => {
    try {
        //^ Get the email from the request body
        const { email } = req.body;

        //^ Check if the email is valid
        const { error: emailValidationError } = emailValidator.validate({ email });

        //^ Return a 400 response if the email is invalid
        if (emailValidationError) {
            throw new Error(emailValidationError);
        }

        //^ Check if the email already exists
        const emailExists = await NewsletterSubscriber.exists({ email });

        //^ Return a 400 response if the email already exists
        if (emailExists) {
            throw new Error("Email already exists");
        }

        //^ Create a test newsLetterSubscriber object
        const newsLetterSubscriberSample = {
            email,
        };

        //^ Validate the newsLetterSubscriber object
        const { error: newsLetterSubscriberValidationError } = emailValidator.validate(newsLetterSubscriberSample);

        //^ Return a 400 response if there is a validation error
        if (newsLetterSubscriberValidationError) {
            throw new Error(newsLetterSubscriberValidationError);
        }

        //^ Create a new newsLetterSubscriber object
        const newNewsLetterSubscriber = new NewsletterSubscriber(newsLetterSubscriberSample);

        //^ Save the new newsLetterSubscriber object
        await newNewsLetterSubscriber.save();

        //^ Return a 201 response
        return res.status(201).json(newNewsLetterSubscriber);
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
};

const deleteNewsletterSubscriber = async (req, res) => {
    try {
        //^ Get the email from the request parameters
        const { email } = req.params;

        //^ Check if the email is valid
        const { error: emailValidationError } = emailValidator.validate({ email });

        //^ Return a 400 response if the email is invalid
        if (emailValidationError) {
            throw new Error(emailValidationError);
        }

        //^ Find the NewsletterSubscriber by email and delete it
        const subscriber = await NewsletterSubscriber.findOneAndDelete({ email });

        //^ Return a 404 response if the subscriber does not exist
        if (!subscriber) {
            return res.status(404).json({ message: "Subscriber not found" });
        }

        //^ Return a 200 response if the subscriber is successfully deleted
        return res.status(200).json({ message: "Subscriber deleted successfully" });
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
};

const getAllNewsletterSubscriber = async (req, res) => {
    try {
        //^ Get all the newsletter subscribers
        const subscribers = await NewsletterSubscriber.find({}, { __v: 0});

        //^ Return a 200 response with the subscribers
        return res.status(200).json(subscribers);
    }
    catch (error) {
        //^ Return a 500 response if there is an error
        return res.status(500).json({ error: error.message });
    }
};

export {
    createNewsletterSubscriber,
    deleteNewsletterSubscriber,
    getAllNewsletterSubscriber,
};