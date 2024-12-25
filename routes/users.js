import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.post("/ban/:id", async (req, res) => {});

router.post("/unban/:id", async (req, res) => {});

export default router;