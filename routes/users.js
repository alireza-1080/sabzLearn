import express from 'express';
import { banUser, unbanEmail, unbanPhone } from '../controllers/users.js';

const router = express.Router();

router.post("/ban/:id", banUser);

router.post("/unban-phone/:phone", unbanPhone);

router.post("/unban-email/:email", unbanEmail);

export default router;
