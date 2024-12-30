import Session from '../models/session.js';
import sessionValidator from '../validators/sessionValidator.js';
import fs from 'fs';
import idValidator from '../validators/idValidator.js';

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


const getSessions = async (req, res) => {
    try {
        //^Get all sessions from the database
        const sessions = await Session
            .find({})
            .select({ createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('course', { title: 1 })
            .populate('instructor', { firstName: 1, lastName: 1 });

        //^Return a 200 response with the sessions
        return res.status(200).json(sessions);
    }
    //^Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getSession = async (req, res) => {
    try {
        //^Get the session id from the request parameters
        const { id } = req.params;

        //^Validate the session id
        const { error } = idValidator.validate({ id });

        //^Return a 400 response if the id is invalid
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        //^Find the session in the database by id
        const session = await Session
            .findById(id)
            .select({ createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('course', { title: 1 })
            .populate('instructor', { firstName: 1, lastName: 1 });

        //^Return a 404 response if the session is not found
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        //^Return a 200 response with the session
        return res.status(200).json(session);
    }
    //^Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateSession = async (req, res) => { };

const deleteSession = async (req, res) => { };

export { createSession, getSessions, getSession, updateSession, deleteSession };