import express from 'express';
import { searchCourses } from '../controllers/search.js';

const router = express.Router();

router
    .route('/courses/:searchKeyWord')
    .get(searchCourses)

export default router;