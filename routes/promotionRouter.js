import express from 'express';
import isTokenReceived from '../middlewares/isTokenReceived.js';
import isTokenValid from '../middlewares/isTokenValid.js';
import isAdmin from '../middlewares/isAdmin.js';
import {
    applyDiscountOnAllCourses,
    removeDiscountFromAllCourses,
    createCoupon,
    deleteCoupon,
    getCoupon,
    getAllCoupons
} from '../controllers/promotion.js';

const router = express.Router();

router
    .route('/campaign/start/:discountPercentage')
    .post(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        applyDiscountOnAllCourses
    )

router
    .route('/campaign/end')
    .post(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        removeDiscountFromAllCourses
    )

router
    .route('/coupon/create')
    .post(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        createCoupon
    )

router
    .route('/coupon/delete/:couponId')
    .delete(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        deleteCoupon
    )

router
    .route('/coupon/:couponCode')
    .get(
        getCoupon
    )

router
    .route('/coupon')
    .get(
        isTokenReceived,
        isTokenValid,
        isAdmin,
        getAllCoupons
    )

export default router;