import Course from "../models/course.js";
import courseValidator from "../validators/courseValidator.js";
import fs from "fs";

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

        //^ Find the course by ID
        const course = await Course.findById(id).select({ __v: 0 , createdAt: 0, updatedAt: 0 })
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

const updateCourse = async (req, res) => { };

const deleteCourse = async (req, res) => { };

export { createCourse, getCourses, getCourse, updateCourse, deleteCourse };