import express from 'express';
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse } from '../controllers/courses.js';
import isTokenReceived from '../middlewares/isTokenReceived.js';
import isTokenValid from '../middlewares/isTokenValid.js';
import isAdmin from '../middlewares/isAdmin.js';
import courseCoverUploader from '../utils/courseCoverUploader.js';

const router = express.Router();

router
    .route('/')
    .post(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        courseCoverUploader.single('cover'),
        createCourse
    )
    .get(getCourses);

router
    .route('/:id')
    .get(getCourse)
    .put(isTokenReceived, isTokenValid, isAdmin, updateCourse)
    .delete(isTokenReceived, isTokenValid, isAdmin, deleteCourse);

export default router;