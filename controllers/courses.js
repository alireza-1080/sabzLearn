import Course from "../models/course.js";
import courseValidator from "../validators/courseValidator.js";
import fs from "fs";
import idValidator from "../validators/idValidator.js";
import User from "../models/user.js";
import CourseUser from "../models/courseUser.js";
import courseUserValidator from "../validators/courseUser.js";
import Category from "../models/category.js";
import jwt from "jsonwebtoken";
import courseUser from "../validators/courseUser.js";

const createCourse = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Please upload an image file (jpg, jpeg, png, webp) less than 2MB" });
        }

        //^ Get the cover from the request file
        const cover = req.file.path;

        //^ Get the rest of the data from the request body
        let { title, description, duration, support, price, href, status, discount, category } = req.body;
        support = support.toLowerCase();
        status = status.toLowerCase();

        //^ Get instructor ID from the request object
        const instructor = req.userId;

        //^ Create course test data
        const courseSample = {
            title,
            description,
            cover,
            duration,
            support,
            price,
            href,
            status,
            discount,
            category,
            instructor,
        };

        //^ Validate the course data
        const { error, value } = courseValidator.validate(courseSample);

        //^ Return a 400 response if there is a validation error
        if (error) {
            throw new Error(error);
        }

        //^ Create a new course object
        const course = new Course(value);

        //^ Save the course to the database
        await course.save();

        //^ Return a 201 response if the course is successfully created
        return res.status(201).json({ message: "Course created successfully" });
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        //^ Delete the uploaded cover if an error occurs
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ error: error.message });
    }
};

const getCourses = async (req, res) => {
    try {
        //^ Get all courses from the database
        const courses = await Course.find().populate("category").populate("instructor", { password: 0 });

        //^ Return a 200 response with the courses
        return res.status(200).json(courses);
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getCourse = async (req, res) => {
    try {
        //^ Get the course ID from the request parameters
        const { id } = req.params;

        //^ Validate the course ID
        const { error } = idValidator.validate({ id });

        //^ Return a 400 response if there is a validation error
        if (error) {
            return res.status(400).json({ error: error });
        }

        //^ Find the course by ID
        const course = await Course.findById(id).select({ __v: 0, createdAt: 0, updatedAt: 0 })
            .populate("category", { __v: 0, createdAt: 0, updatedAt: 0 })
            .populate("instructor", { password: 0, __v: 0, createdAt: 0, updatedAt: 0 })
            .populate('sessions', { __v: 0, createdAt: 0, updatedAt: 0 })
            .populate({
                path: 'comments',
                match: { isApproved: true },
                select: { __v: 0, createdAt: 0, updatedAt: 0 }
            });

        //^ Return a 404 response if the course is not found
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        //^ Get the number of subscribers for the course
        const subscribersCount = await CourseUser.countDocuments({ course: id });
        course._doc.subscribersCount = subscribersCount;

        //^ Get the average rating for the course
        const courseComments = course.comments;
        let totalRating = 0;
        let totalComments = 0;
        courseComments.forEach(comment => {
            totalRating += comment.rate;
            totalComments++;
        });
        const averageRating = totalRating / totalComments;

        //^ Add the average rating to the course object
        course._doc.averageRating = averageRating;

        //* Check if the user is subscribed to the course
        //^ Get the request headers
        const { authorization } = req.headers;

        //^ Extract the access token from the request headers if available
        const accessToken = authorization ? authorization.replace("Bearer ", "") : null;

        //^ Return the course with isSubscribed: false if the access token is not provided
        if (!accessToken) {
            course._doc.isSubscribed = false;
            return res.status(200).json(course);
        }

        //^ Validate the access token
        const accessTokenValidation = jwt.verify(accessToken, process.env.JWT_SECRET);

        //^ Return the course with isSubscribed: false if the access token is not valid
        if (!accessTokenValidation) {
            course._doc.isSubscribed = false;
            return res.status(200).json(course);
        }

        //^ Get the user ID from the access token
        const userId = accessTokenValidation.userId;

        //^ Check if the user is subscribed to the course
        const userCourse = await CourseUser.findOne({ course: id, user: userId })

        //^ Add isSubscribed to the course object
        course._doc.isSubscribed = userCourse ? true : false;

        //^ Return a 200 response with the course
        return res.status(200).json(course);
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateCourse = async (req, res) => {
    try {
        //^ Get the course ID from the request parameters
        const { id } = req.params;

        //^ Validate the course ID
        const { error: validationError } = idValidator.validate({ id });

        //^ Return a 400 response if there is a validation error

        if (validationError) {
            throw new Error(validationError);
        }

        //^ Find the course by ID
        const course = await Course.findById(id);

        //^ Return a 404 response if the course is not found
        if (!course) {
            throw new Error("Course not found");
        }

        //^ Get the cover from the request file if available
        const cover = req.file ? req.file.path : course.cover;

        //^ Get the rest of the data from the request body
        let {
            title: newTitle,
            description: newDescription,
            duration: newDurations,
            support: newSupport,
            price: newPrice,
            href: newHref,
            status: newStatus,
            discount: newDiscount,
            category: newCategory,
        } = req.body;

        //^ Get instructor ID from the request object
        const instructor = req.userId;

        //^ Create course test data
        const courseSample = {
            title: newTitle ? newTitle : course.title,
            description: newDescription ? newDescription : course.description,
            cover: cover ? cover : course.cover,
            duration: newDurations ? newDurations : course.duration,
            support: newSupport ? newSupport : course.support,
            price: newPrice ? newPrice : course.price,
            href: newHref ? newHref : course.href,
            status: newStatus ? newStatus : course.status,
            discount: newDiscount ? newDiscount : course.discount,
            category: newCategory ? newCategory : course.category.toString(),
            instructor,
        };

        //^ Validate the course data
        const { error, value } = courseValidator.validate(courseSample);

        //^ Return a 400 response if there is a validation error
        if (error) {
            throw new Error(error);
        }

        //^ Delete the old cover if a new cover is uploaded
        if (req.file && req.file.path !== course.cover) {
            fs.unlinkSync(course.cover);
        }

        //^ Update the course in the database
        const updateResult = await Course.findOneAndUpdate({ _id: id }, value);

        //^ Return a 200 response if the course is successfully updated
        if (updateResult) {
            return res.status(200).json({ message: "Course updated successfully" });
        }

        //^ Return a 500 response if the course is not updated
        else {
            return res.status(500).json({ error: "Course could not be updated" });
        }
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        //^ Delete the uploaded cover if an error occurs
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ error: error.message });
    };
};

const deleteCourse = async (req, res) => {
    try {
        //^ Get the course ID from the request parameters
        const { id } = req.params;

        //^ Validate the course ID
        const { error: validationError } = idValidator.validate({ id });

        //^ Return a 400 response if there is a validation error
        if (validationError) {
            return res.status(400).json({ error: validationError.message });
        }

        //^ Find the course by ID
        const course = await Course.findById(id);

        //^ Return a 404 response if the course is not found
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        //^ Delete the course from the database
        const deleteResult = await Course.findOneAndDelete({ _id: id });

        //^ Delete the cover from the server
        if (deleteResult) {
            fs.unlinkSync(course.cover);
        }

        //^ Return a 200 response if the course is successfully deleted
        if (deleteResult) {
            return res.status(200).json({ message: "Course deleted successfully" });
        }

        //^ Return a 500 response if the course is not deleted
        else {
            return res.status(500).json({ error: "Course could not be deleted" });
        }
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const registerCourse = async (req, res) => {
    try {
        //^ Get the course ID from the request parameters
        const { id } = req.params;

        //^ Validate the course ID
        const { error: courseValidationError } = idValidator.validate({ id });

        //^ Return a 400 response if there is a validation error
        if (courseValidationError) {
            throw new Error("Course ID must be a valid ObjectId");
        }

        //^ Find the course by ID
        const course = await Course.findById(id);

        //^ Return a 404 response if the course is not found
        if (!course) {
            throw new Error("Course not found");
        }

        //^ Get the user ID from the request object
        const user = req.userId;

        //^ Validate the user ID
        const { error: userValidationError } = idValidator.validate({ id: user });

        //^ Return a 400 response if there is a validation error
        if (userValidationError) {
            throw new Error("User ID must be a valid ObjectId");
        }

        //^ Check if the user exists in User
        const userExists = await User.findById(user);

        //^ Return a 404 response if the user is not found
        if (!userExists) {
            throw new Error("User not found");
        }

        //^ Check if the user is already registered for the course
        const userCourse = await CourseUser.findOne({ course: id, user });

        //^ Return a 400 response if the user is already registered
        if (userCourse) {
            throw new Error("User already registered for this course");
        }

        //^ Get the course price from the request body
        const { signUpPrice } = req.body;

        //^ Create course user test data
        const courseUserSample = {
            course: id,
            user,
            signUpPrice,
        };
        console.log(courseUserSample);

        //^ Validate the course user data
        const { error: courseUserValidationError, value: validatedCourseUser } = courseUserValidator.validate(courseUserSample);

        //^ Return a 400 response if there is a validation error
        if (courseUserValidationError) {
            throw new Error(courseUserValidationError);
        }

        //^ Create a new course user object
        const courseUser = new CourseUser(validatedCourseUser);

        //^ Save the course user to the database
        await courseUser.save();

        //^ Return a 201 response if the course user is successfully created
        return res.status(201).json({ message: "Course registration successful" });
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getCoursesbyCategory = async (req, res) => {
    try {
        //^ Get the category ID from the request parameters
        const { id } = req.params;

        //^ Validate the category ID
        const { error: categoryIdValidation } = idValidator.validate({ id });

        //^ Return a 400 response if there is a validation error
        if (categoryIdValidation) {
            throw new Error("Category ID must be a valid ObjectId");
        }

        //^ Find the category by ID
        const category = await Category.findById(id);

        //^ Return a 404 response if the category is not found
        if (!category) {
            throw new Error("Category not found");
        }

        //^ Find the courses by category ID
        const courses = await Course.find({ category: id }, { __v: 0, createdAt: 0, updatedAt: 0 })
            .populate("instructor", { firstName: 1, lastName: 1 });

        //^ Return a 200 response with the courses
        return res.status(200).json(courses);
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export { createCourse, getCourses, getCourse, updateCourse, deleteCourse, registerCourse, getCoursesbyCategory };