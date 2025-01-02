import Course from '../models/course.js';
import percentValidator from '../validators/percentValidator.js';
import Coupon from '../models/coupon.js';
import couponValidator from '../validators/couponValidator.js';
import User from '../models/user.js';
import idValidator from '../validators/idValidator.js';

const applyDiscountOnAllCourses = async (req, res) => {
    try {
        //^ Get the discount percentage from the request params
        const { discountPercentage: percentage } = req.params;

        //^ Validate the discount percentage
        const { error: discountPercentageValidationError } = percentValidator.validate({ percentage });

        //^ Return a 400 response if there is a validation error
        if (discountPercentageValidationError) {
            throw new Error(discountPercentageValidationError);
        }

        //^ Find all the courses and update the discount
        const courses = await Course.updateMany({}, { discount: percentage });

        //^ Return a 200 response if the discount is successfully applied
        return res.status(200).json({ message: `Discount of ${percentage}% applied on all courses` });
    }
    catch (error) {
        //^ Return a 500 response if there is an error
        return res.status(500).json({ message: error.message });
    }
}

const removeDiscountFromAllCourses = async (req, res) => {
    try {
        //^ Find all the courses and remove the discount
        const courses = await Course.updateMany({}, { discount: 0 });

        //^ Return a 200 response if the discount is successfully removed
        return res.status(200).json({ message: "Discount removed from all courses" });
    }
    catch (error) {
        //^ Return a 500 response if there is an error
        return res.status(500).json({ message: error.message });
    }
}

const createCoupon = async (req, res) => {
    try {
        //^ Get the admin id from the request object
        const adminId = req.userId;

        //^ Get the coupon details from the request body
        const { code, percentage, course, maxRedemptions } = req.body;

        //^ Create a new coupon test object
        const couponSample = {
            code,
            percentage,
            course,
            maxRedemptions,
            creator: adminId,
        };
        console.log(couponSample);

        //^ Validate the coupon object
        const { error: couponValidationError } = couponValidator.validate(couponSample);

        //^ Return a 400 response if there is a validation error
        if (couponValidationError) {
            throw new Error(couponValidationError);
        }

        //^ Check is the course exists
        const courseExists = await Course.exists({ _id: course });

        //^ Return a 400 response if the course does not exist
        if (!courseExists) {
            throw new Error("Course does not exist");
        }

        //^ Check if the admin exists
        const adminExists = await User.exists({ _id: adminId, role: "ADMIN" });

        //^ Return a 400 response if the admin does not exist
        if (!adminExists) {
            throw new Error("Admin does not exist");
        }

        //^ Create a new coupon object
        const newCoupon = new Coupon(couponSample);

        //^ Save the new coupon object
        await newCoupon.save();

        //^ Get coupon details
        const couponDetails = await Coupon.findById(newCoupon._id)
            .select({ code: 1, percentage: 1, course: 1, maxRedemptions: 1, creator: 1 })
            .populate("course", { title: 1 })
            .populate("creator", { firstName: 1, lastName: 1 });

        //^ Return a 201 response if the coupon is successfully created
        return res.status(201).json(couponDetails);
    }
    catch (error) {
        //^ Return a 500 response if there is an error
        return res.status(500).json({ message: error.message });
    }
}

const deleteCoupon = async (req, res) => {
    try {
        //^ Get the coupon id from the request params
        const { couponId } = req.params;

        //^ Validate the coupon ID
        const { error: couponIdValidationError } = idValidator.validate({ id: couponId });

        //^ Return a 400 response if there is a validation error
        if (couponIdValidationError) {
            throw new Error("Coupon ID must be a valid ObjectId");
        }

        //^ Find the coupon object by ID and delete it
        const coupon = await Coupon.findByIdAndDelete(couponId);

        //^ Return a 404 response if the coupon does not exist
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        //^ Return a 200 response if the coupon is successfully deleted
        return res.status(200).json({ message: "Coupon deleted successfully" });
    }
    catch (error) {
        //^ Return a 500 response if there is an error
        return res.status(500).json({ message: error.message });
    }
}

const getCoupon = async (req, res) => {
    try {
        //^ Get the coupon code from the request params
        const { couponCode } = req.params;

        //^ Get course id from the request body
        const { course } = req.body;

        //^ Validate the courese ID
        const { error: courseIdValidationError } = idValidator.validate({ id: course });

        //^ Return a 400 response if there is a validation error
        if (courseIdValidationError) {
            throw new Error("Course ID must be a valid ObjectId");
        }

        //^ Find the coupon object by code
        const coupon = await Coupon.findOne({ code: couponCode })
            .select({ code: 1, percentage: 1, course: 1, maxRedemptions: 1, creator: 1 })
            .populate("course", { title: 1 })
            .populate("creator", { firstName: 1, lastName: 1 });

        //^ Return a 404 response if the coupon does not exist
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        
        //^ Check if the course matches the coupon course
        if (coupon.course._id.toString() != course) {
            throw new Error("Coupon is not valid for this course");
        }

        //^ Return a 200 response with the coupon
        return res.status(200).json(coupon);
    }
    catch (error) {
        //^ Return a 500 response if there is an error
        return res.status(500).json({ message: error.message });
    }
}

const getAllCoupons = async (req, res) => { 
    try {
        //^ Find all the coupons
        const coupons = await Coupon.find({})
            .select({ code: 1, percentage: 1, course: 1, maxRedemptions: 1, creator: 1 })
            .populate("course", { title: 1 })
            .populate("creator", { firstName: 1, lastName: 1 });

        //^ Return a 200 response with the coupons
        return res.status(200).json(coupons);
    }
    catch (error) {
        //^ Return a 500 response if there is an error
        return res.status(500).json({ message: error.message });
    }
}

export {
    applyDiscountOnAllCourses,
    removeDiscountFromAllCourses,
    createCoupon,
    deleteCoupon,
    getCoupon,
    getAllCoupons
};