import express from 'express';
import {
    createNewsletterSubscriber,
    deleteNewsletterSubscriber,
    getAllNewsletterSubscriber,
} from '../controllers/newsletterController.js';
import isTokenReceived from '../middlewares/isTokenReceived.js';
import isTokenValid from '../middlewares/isTokenValid.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router
    .route('/')
    .get(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        getAllNewsletterSubscriber
    )
    .post(createNewsletterSubscriber);

router
    .route('/:email')
    .delete(deleteNewsletterSubscriber);

export default router;