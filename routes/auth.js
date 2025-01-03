import express from 'express';
import { login, register, getMe } from '../controllers/auth.js'; // Ensure this path is correct

const router = express.Router();

router
    .route('/register')
    .post(register);

router
    .route('/login')
    .post(login);

router
    .route('/me')
    .get(getMe);


export default router;