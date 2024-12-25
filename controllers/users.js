import BannedPhone from "../models/bannedPhone.js";
import User from "../models/user.js";
import BannedEmail from "../models/bannedEmail.js";


const banUser = async (req, res) => {
    try {
        //^ Get the user id from the request params
        const { id } = req.params;

        //^ Find the user by id
        const user = await User.findById(id);

        //^ Return a 404 response if the user is not found
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        //^ add user's number to the banned phone collection
        const bannedPhone = new BannedPhone({ phone: user.phone });
        await bannedPhone.save();

        //^ add user's email to the banned email collection
        const bannedEmail = new BannedEmail({ email: user.email });
        await bannedEmail.save();

        //^ Delete the user from the database
        await User.findByIdAndDelete(id);

        //^ Return a 200 response
        return res.status(200).json({ message: "User banned & removed from database successfully" });
    }
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const unbanPhone = async (req, res) => {
    try {
        //^ Get the phone number from the request params
        const { phone } = req.params;

        //^ Find the banned phone by phone number
        const bannedPhone = await BannedPhone.findOne({ phone });

        //^ Return a 404 response if the phone number is not found
        if (!bannedPhone) {
            return res.status(404).json({ error: "Phone number not found" });
        }

        //^ Delete the phone number from the banned phone collection
        await BannedPhone.findOneAndDelete({ phone });

        //^ Return a 200 response
        return res.status(200).json({ message: "Phone number unbanned successfully" });
    }
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const unbanEmail = async (req, res) => {
    try {
        //^ Get the email from the request params
        const { email } = req.params;

        //^ Find the banned email by email
        const bannedEmail = await BannedEmail.findOne({ email });

        //^ Return a 404 response if the email is not found
        if (!bannedEmail) {
            return res.status(404).json({ error: "Email not found" });
        }

        //^ Delete the email from the banned email collection
        await BannedEmail.findOneAndDelete({ email });

        //^ Return a 200 response
        return res.status(200).json({ message: "Email unbanned successfully" });
    }
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export { banUser, unbanPhone, unbanEmail };