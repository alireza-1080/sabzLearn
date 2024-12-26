import BannedPhone from "../models/bannedPhone.js";
import User from "../models/user.js";
import BannedEmail from "../models/bannedEmail.js";
import userValidator from "../validators/userValidator.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const banUser = async (req, res) => {
    try {
        //^ Get the user id from request object
        const id = req.userId;

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

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const removeUserById = async (req, res) => {
    try {
        //^ Get the user id from the request object
        const id = req.userId;

        //^ Find the user by id
        const user = await User.findById(id);

        //^ Return a 404 response if the user is not found
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        //^ Delete the user from the database
        await User.findByIdAndDelete(id);

        //^ Return a 200 response
        return res.status(200).json({ message: "User removed from database successfully" });

    }
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const changeRole = async (req, res) => {
    try {
        //^ Get the user id from the request object
        const id = req.userId;
        console.log(id);

        //^ Find the user by id
        const user = await User.findById(id);

        //^ Return a 404 response if the user is not found
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        //^ Change the user's role to the new role
        user.role = user.role === "USER" ? "ADMIN" : "USER";

        //^ Save the user to the database
        await user.save();

        //^ Return a 200 response
        return res.status(200).json({ message: "User role changed successfully" });
    }
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const updateUserInfo = async (req, res) => {
    try {
        //^ Get the user id from the request object
        const id = req.userId;

        //^ Check if the id is valid
        const isIdValid = mongoose.Types.ObjectId.isValid(id);

        //^ Return a 400 response if the id is invalid
        if (!isIdValid) {
            return res.status(400).json({ error: "Invalid user id" });
        }

        //^ Find the user by id
        const user = await User.findById(id);

        //^ Return a 404 response if the user is not found
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        //^ Get the new user info from the request body
        const { firstName: newFirstName, lastName: newLastName, email: newEmail, phone: newPhone, username: newUsername, password: newPassword, confirmPassword } = req.body;

        //^ Create new user object
        const newUser = {
            firstName: newFirstName ? newFirstName : user.firstName,
            lastName: newLastName ? newLastName : user.lastName,
            email: newEmail ? newEmail.toLowerCase() : user.email,
            phone: newPhone ? newPhone : user.phone,
            username: newUsername ? newUsername.toLowerCase() : user.username,
            password: newPassword ? newPassword : "ValidPassword123!",
            confirmPassword: confirmPassword ? confirmPassword : "ValidPassword123!",
        };

        console.log(newUser);

        //^ Validate the new user info
        const { error } = userValidator.validate(newUser);

        //^ Return a 400 response if the new user info is invalid
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        //^ Hash the new password
        if (newPassword) {
            newUser.password = await bcrypt.hash(newUser.password, 10);
        } else {
            delete newUser.password;
        }

        //^ Update the user info
        await User.findByIdAndUpdate(id, newUser);

        //^ Return a 200 response
        return res.status(200).json({ message: "User info updated successfully" });
    }
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export { banUser, unbanPhone, unbanEmail, getAllUsers, removeUserById, changeRole, updateUserInfo };