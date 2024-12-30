import express from 'express';
import { createComment, getComments, getComment, deleteComment, approveComment } from '../controllers/comments.js';
import isTokenReceived from '../middlewares/isTokenReceived.js';
import isTokenValid from '../middlewares/isTokenValid.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router
    .route('/')
    .post(
        isTokenReceived,
        isTokenValid,
        createComment
    )
    .get(getComments);

router
    .route('/:id')
    .get(getComment)
    .delete(deleteComment)
    .put(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        approveComment
    );

export default router;