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


export { banUser };