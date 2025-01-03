import ContactUs from '../models/contactUs.js';
import contactUsValidator from '../validators/contactUsValidator.js';
import idValidator from '../validators/idValidator.js';
import nodemailer from 'nodemailer';
import contactUsReplyValidator from '../validators/contactUsReplyValidatore.js';

const createContact = async (req, res) => {
    try {
        //^ Get the data from the request body
        const { name, email, message, phone } = req.body;

        //^ Create a contactUs test object
        const contactUsSample = {
            name,
            email,
            message,
            phone,
        };

        //^ Validate the contactUs object
        const { error: contactUsValidationError } = contactUsValidator.validate(contactUsSample);

        //^ Return a 400 response if there is a validation error
        if (contactUsValidationError) {
            throw new Error(contactUsValidationError);
        }

        //^ Create a new contactUs object
        const newContactUs = new ContactUs(contactUsSample);

        //^ Save the new contactUs object
        await newContactUs.save();

        //^ Return a 201 response
        return res.status(201).json(newContactUs);
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
}

const getAllContacts = async (_req, res) => {
    try {
        //^ Get all the contactUs objects
        const contacts = await ContactUs.find()
            .select({ updatedAt: 0, __v: 0 });

        //^ Return a 200 response
        return res.status(200).json(contacts);
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
}

const getContact = async (req, res) => {
    try {
        //^ Get the contactUs ID from the request parameters
        const { id: contactUsId } = req.params;

        //^ Validate the contactUs ID
        const { error: contactUsIdValidationError } = idValidator.validate({ id: contactUsId });

        //^ Return a 400 response if there is a validation error
        if (contactUsIdValidationError) {
            throw new Error(contactUsIdValidationError);
        }

        //^ Find the contactUs object by ID
        const contact = await ContactUs.findById(contactUsId)
            .select({ updatedAt: 0, __v: 0 });

        //^ Return a 404 response if the contactUs object does not exist
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        //^ Return a 200 response with the contactUs object
        return res.status(200).json(contact);
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
}

const deleteContact = async (req, res) => {
    try {
        //^ Get the contactUs ID from the request parameters
        const { id: contactUsId } = req.params;

        //^ Validate the contactUs ID
        const { error: contactUsIdValidationError } = idValidator.validate({ id: contactUsId });

        //^ Return a 400 response if there is a validation error
        if (contactUsIdValidationError) {
            throw new Error(contactUsIdValidationError);
        }

        //^ Find the contactUs object by ID and delete it
        const contact = await ContactUs.findByIdAndDelete(contactUsId);

        //^ Return a 404 response if the contactUs object does not exist
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        //^ Return a 204 response
        return res.status(200).json({ message: "Contact deleted successfully" });
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const replyToContact = async (req, res) => {
    try {
        //^ Get the contactUs ID from the request parameters
        const { id: contactUsId } = req.params;

        //^ Validate the contactUs ID
        const { error: contactUsIdValidationError } = idValidator.validate({ id: contactUsId });

        //^ Return a 400 response if there is a validation error
        if (contactUsIdValidationError) {
            throw new Error(contactUsIdValidationError);
        }

        //^ Check if the contactUs object exists
        const contact = await ContactUs.findById(contactUsId);

        //^ Return a 404 response if the contactUs object does not exist
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        //^ Check if the contactUs object has isItReplied: true
        if (contact.isItReplied) {
            return res.status(400).json({ message: "Contact already replied" });
        }

        //^ Get the reply subject and message from the request body
        const { subject, message } = req.body;

        //^ Create reply message test object
        const replyMessage = {
            subject,
            message,
            contactEmail: contact.email,
        };

        //^ Validate the reply message object
        const { error: replyMessageValidationError } = contactUsReplyValidator.validate(replyMessage);

        //^ Return a 400 response if there is a validation error
        if (replyMessageValidationError) {
            throw new Error(replyMessageValidationError);
        }

        //^ Create a transporter object
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        //^ Create mail options
        const mailOptions = {
            from: process.env.EMAIL,
            to: contact.email,
            subject,
            text: message,
        };

        //^ Send the email
        const mailInfo = await transporter.sendMail(mailOptions);

        //^ Return a 400 response if there is an error
        if (!mailInfo) {
            throw new Error("Error sending email");
        }

        //^ Update the contactUs object
        contact.isItReplied = true;

        //^ Save the updated contactUs object
        await contact.save();

        //^ Return a 200 response
        return res.status(200).json({ message: "Contact replied successfully" });
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
}

export { createContact, getAllContacts, getContact, deleteContact, replyToContact };