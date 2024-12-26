import express from 'express';
import { banUser, unbanEmail, unbanPhone, getAllUsers, removeUserById } from '../controllers/users.js';
import isAdmin from '../middlewares/isAdmin.js';
import isTokenValid from '../middlewares/isTokenValid.js';
import isTokenReceived from '../middlewares/isTokenReceived.js';
import isIdValid from '../middlewares/isIdValid.js';

const router = express.Router();

router.use(isTokenReceived)
router.use(isTokenValid)
router.use(isAdmin)

router
    .route("/ban/:id")
    .post(isIdValid, banUser);

router
    .route("/unban-phone/:phone")
    .post(unbanPhone);

router
    .route("/unban-email/:email")
    .post(unbanEmail);

router
    .route("/")
    .get(getAllUsers);

router
    .route("/:id")
    .delete(isIdValid, removeUserById);

export default router;
