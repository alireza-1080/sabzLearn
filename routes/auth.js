import express from 'express';
import { login, register, getMe } from '../controllers/auth.js'; // Ensure this path is correct

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', getMe);

export default router;