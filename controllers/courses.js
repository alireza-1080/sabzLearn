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
        console.log(value);

        //^ Return a 400 response if there is a validation error
        if (error) {
            //^ Delete the uploaded cover
            fs.unlinkSync(cover);
            return res.status(400).json({ error: error.message });
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
        return res.status(500).json({ error: error.message });
    }
};

const getCourses = async (req, res) => { };

const getCourse = async (req, res) => { };

const updateCourse = async (req, res) => { };

const deleteCourse = async (req, res) => { };

export { createCourse, getCourses, getCourse, updateCourse, deleteCourse };