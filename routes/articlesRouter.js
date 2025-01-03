import express from 'express';
import isTokenReceived from '../middlewares/isTokenReceived.js';
import isTokenValid from '../middlewares/isTokenValid.js';
import isAdmin from '../middlewares/isAdmin.js';
import {
    getArticles,
    createArticle,
    getArticleById,
    updateArticle,
    deleteArticle,
    updateArticleCover,
    getArticleByHref,
    getDrafts,
    createDraft,
    getDraftById,
    updateDraft,
    deleteDraft
} from '../controllers/articles.js';

const router = express.Router();

router
    .route('/')
    .get(getArticles)
    .post(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        createArticle
    )

router
    .route('/id/:articleId')
    .get(getArticleById)
    .put(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        updateArticle
    )
    .delete(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        deleteArticle
    )

router
    .route('id/:articleId/cover')
    .put(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        updateArticleCover
    )

router
    .route('/href/:articleHref')
    .get(getArticleByHref)

router
    .route('/draft')
    .get(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        getDrafts)
    .post(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        createDraft)

router
    .route('/draft/:draftId')
    .get(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        getDraftById)
    .put(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        updateDraft)
    .delete(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        deleteDraft)


export default router;