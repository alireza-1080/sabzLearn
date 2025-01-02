import Course from "../models/course.js";

const searchCourses = async (req, res) => {
    try {
        //^ Get the search keyword from the request parameters
        const { searchKeyWord } = req.params;

        //^ Find the courses that match the search keyword
        const courses = await Course.find({
            $or: [
                { title: { $regex: searchKeyWord, $options: 'i' } },
                { description: { $regex: searchKeyWord, $options: 'i' } }
            ]
        });

        //^ Return a 200 response
        return res.status(200).json(courses);
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
};

export { searchCourses };