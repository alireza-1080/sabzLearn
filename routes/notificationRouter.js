import express from 'express';
import isTokenReceived from '../middlewares/isTokenReceived.js';
import isTokenValid from '../middlewares/isTokenValid.js';
import isAdmin from '../middlewares/isAdmin.js';
import {
    createNotification,
    getAdminNotifications,
    markNotificationAsSeen
} from '../controllers/notification.js';

const router = express.Router();

router
    .route('/')
    .post(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        createNotification
    )

router
    .route('/admin')
    .get(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        getAdminNotifications
    )

router
    .route('/admin/seen/:notificationId')
    .put(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        markNotificationAsSeen
    )

export default router;