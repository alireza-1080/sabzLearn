import User from "../models/user.js";
import userValidator from "../validators/userValidator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import normalizedPhoneNumber from "../utils/normalizePhoneNumber.js";

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

            //^ Check if the user is the first user to be registered
            const userCount = await User.countDocuments()
            if (userCount === 0) {
                value.role = "ADMIN";
            }

            //^ make sure the email is all lowercase
            value.email = value.email.toLowerCase();

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

const login = async (req, res) => { };

const getMe = async (req, res) => { };

export { register, login, getMe };