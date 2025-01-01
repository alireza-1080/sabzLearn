import express from 'express';
import {
    createContact,
    getAllContacts,
    getContact,
    deleteContact,
    replyToContact
} from '../controllers/contactUs.js';
import isTokenReceived from '../middlewares/isTokenReceived.js';
import isTokenValid from '../middlewares/isTokenValid.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router
    .route('/')
    .post(createContact)
    .get(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        getAllContacts
    )

router
    .route('/:id')
    .get(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        getContact)
    .delete(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        deleteContact)
    .put(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        replyToContact)

export default router;