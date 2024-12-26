import express from 'express';
import { banUser, unbanEmail, unbanPhone, getAllUsers, removeUserById, changeRole } from '../controllers/users.js';
import isAdmin from '../middlewares/isAdmin.js';
import isTokenValid from '../middlewares/isTokenValid.js';
import isTokenReceived from '../middlewares/isTokenReceived.js';
import isIdValid from '../middlewares/isIdValid.js';

const router = express.Router();

router
    .route("/ban/:id")
    .post(isTokenReceived, isTokenValid, isAdmin, isIdValid, banUser);

router
    .route("/unban-phone/:phone")
    .post(isTokenReceived, isTokenValid, isAdmin, unbanPhone);

router
    .route("/unban-email/:email")
    .post(isTokenReceived, isTokenValid, isAdmin, unbanEmail);

router
    .route("/")
    .get(isTokenReceived, isTokenValid, isAdmin, getAllUsers);

router
    .route("/:id")
    .delete(isTokenReceived, isTokenValid, isAdmin, isIdValid, removeUserById);

router
    .route("/role/:id")
    .put(isTokenReceived, isTokenValid, isAdmin, isIdValid, changeRole);

export default router;
