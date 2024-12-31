import express from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory, getCategoryById } from '../controllers/categories.js';
import isTokenReceived from '../middlewares/isTokenReceived.js';
import isTokenValid from '../middlewares/isTokenValid.js';
import isAdmin from '../middlewares/isAdmin.js';
import isIdValid from '../middlewares/isIdValid.js';
import { getCoursesbyCategory } from '../controllers/courses.js';

const router = express.Router();

router
    .route('/')
    .post(isTokenReceived, isTokenValid, isAdmin, createCategory)
    .get(getCategories);

router
    .route("/:id")
    .put(isTokenReceived, isTokenValid, isAdmin, isIdValid, updateCategory)
    .delete(isTokenReceived, isTokenValid, isAdmin, isIdValid, deleteCategory)
    .get(getCategoryById);

router
    .route("/:id/courses")
    .get(getCoursesbyCategory);


export default router;