import Course from "../models/course.js";
import courseValidator from "../validators/courseValidator.js";
import fs from "fs";
import idValidator from "../validators/idValidator.js";

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
            .populate("instructor", { password: 0, __v: 0, createdAt: 0, updatedAt: 0 });

        //^ Return a 404 response if the course is not found
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

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
            return res.status(400).json({ error: validationError.message });
        }

        //^ Find the course by ID
        const course = await Course.findById(id);

        //^ Return a 404 response if the course is not found
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
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

export { createCourse, getCourses, getCourse, updateCourse, deleteCourse };