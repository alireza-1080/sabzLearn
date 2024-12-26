import express from 'express';
import { banUser, unbanEmail, unbanPhone, getAllUsers } from '../controllers/users.js';
import isAdmin from '../middlewares/isAdmin.js';
import isTokenValid from '../middlewares/isTokenValid.js';
import isTokenReceived from '../middlewares/isTokenReceived.js';

const router = express.Router();

router.use(isTokenReceived)
router.use(isTokenValid)
router.use(isAdmin)

router.post("/ban/:id", banUser);

router.post("/unban-phone/:phone", unbanPhone);

router.post("/unban-email/:email", unbanEmail);

router.get("/", getAllUsers);

export default router;
