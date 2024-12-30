import express from 'express';
import { createSession, getSessions, getSession, updateSession, deleteSession } from '../controllers/sessions.js';
import isTokenReceived from '../middlewares/isTokenReceived.js';
import isTokenValid from '../middlewares/isTokenValid.js';
import isAdmin from '../middlewares/isAdmin.js';
import sessionVideoUploader from '../utils/sessionVideoUploader.js';

const router = express.Router();

router
    .route('/')
    .post(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        sessionVideoUploader.single('video'),
        createSession
    )
    .get(getSessions);

router
    .route('/:id')
    .get(getSession)
    .put(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        sessionVideoUploader.single('video'),
        updateSession
    )
    .delete(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        deleteSession
    );


export default router;
