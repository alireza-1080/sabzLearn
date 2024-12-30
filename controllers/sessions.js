import Session from '../models/session.js';
import sessionValidator from '../validators/sessionValidator.js';
import fs from 'fs';

const createSession = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Videos is required and must be one of the following formats: ['video/mp4', 'video/mpeg', 'video/ogg', 'video/quicktime', 'video/webm', 'video/x-ms-wmv', 'video/x-flv', 'video/x-msvideo', 'video/3gpp', 'video/3gpp2']" });
        }

        //^Get video from the request file
        const video = req.file.path;

        //^Get the rest of the session details from the request body
        const { title, time, isItFree, course } = req.body;

        //^Get the instructor from the request user
        const instructor = req.userId;

        //^Create session test data
        const sessionSample = {
            title,
            time,
            video,
            isItFree,
            course,
            instructor
        };

        //^Validate the session data
        const { error, value } = sessionValidator.validate(sessionSample);

        //^Return a 400 response if there is a validation error
        if (error) {
            throw new Error(error);
        }

        //^Create a new session
        const session = new Session(value);

        //^Save the session to the database
        await session.save();

        //^Return a 201 response if the session is successfully created
        return res.status(201).json({ message: "Session created successfully" });
    }
    //^Catch any errors and return a 500 response
    catch (error) {
        //^Delete the uploaded video if an error occurs
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ error: error.message });
    }
}


const getSessions = async (req, res) => { };

const getSession = async (req, res) => { };

const updateSession = async (req, res) => { };

const deleteSession = async (req, res) => { };

export { createSession, getSessions, getSession, updateSession, deleteSession };