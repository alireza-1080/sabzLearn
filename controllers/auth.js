import User from "../models/user.js";
import userValidator from "../validators/userValidator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import normalizedPhoneNumber from "../utils/normalizePhoneNumber.js";
import BannedPhone from "../models/bannedPhone.js";
import BannedEmail from "../models/bannedEmail.js";

const register = async (req, res) => {
    try {
        //^ get request body
        const requestBody = req.body;

        //^ Normalize the phone number
        requestBody.phone = normalizedPhoneNumber(requestBody.phone);

        //^ Validate the user input
        const { error, value } = userValidator.validate(req.body);

        //^ Return a 400 response if there is an error
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        //^ process the user input when it is valid
        if (value) {

            //^ hash the password
            const hashedPassword = await bcrypt.hash(value.password, 10);
            value.password = hashedPassword;

            //^ Refuse to register a user with a banned phone number
            const bannedPhone = await BannedPhone.findOne({ phone: value.phone });
            if (bannedPhone) {
                return res.status(400).json({ error: "Phone number is banned" });
            }

            //^ Refuse to register a user with a banned email
            const bannedEmail = await BannedEmail.findOne({ email: value.email });
            if (bannedEmail) {
                return res.status(400).json({ error: "Email is banned" });
            }

            //^ Check if the user is the first user to be registered
            const userCount = await User.countDocuments()
            if (userCount === 0) {
                value.role = "ADMIN";
            }

            //^ make sure the email is all lowercase
            value.email = value.email.toLowerCase();

            //^ make sure the username is all lowercase
            value.username = value.username.toLowerCase();

            //^ Create a new user
            const user = new User(value);

            //^ Generate an access token
            const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });

            //^ Save the user to the database
            await user.save();

            //^ Remove password from the response & return the user object
            delete user._doc.password;

            //^ Return the user object & access token
            return res.status(201).json({ message: "User registered successfully", user, accessToken });
        }
    }
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        //^ get rquest body
        //? identifier can be either email or username or phone
        let { identifier, password } = req.body;

        //^ make sure the identifier is all lowercase
        identifier = identifier.toLowerCase();

        //^ Find the user by email or username or phone
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { username: identifier },
                { phone: identifier },
            ],
        });

        //^ Return a 404 response if the user is not found
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        //^ Compare the password
        const validPassword = await bcrypt.compare(password, user.password);

        //^ Return a 400 response if the password is invalid
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }

        //^ Generate an access token
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        //^ Remove password from the response & return the user object
        delete user._doc.password;

        //^ Return the user object & access token
        return res.status(200).json({ message: "Login successful", user, accessToken });
    }
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error });
    };
}

const getMe = async (req, res) => { };

export { register, login, getMe };