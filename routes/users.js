import express from 'express';
import { banUser } from '../controllers/users.js';

const router = express.Router();

router.post("/ban/:id", banUser);

router.post("/unban-phone/:id", async (req, res) => {});

export default router;
