import Comment from "../models/comment.js";
import Course from "../models/course.js";
import User from "../models/user.js";
import commentValidator from "../validators/commentValidator.js";
import idValidator from "../validators/idValidator.js";

const createComment = async (req, res) => {
    try {
        //^ Get the user ID from the request object
        const creator = req.userId;

        //^ Get rest of the data from the request body
        const { body, course, rate, isItReply, mainComment } = req.body;

        //^ Validate the course
        const { error: courseIdValidationError } = idValidator.validate({ id: course });

        //^ Return a 400 response if there is a validation error
        if (courseIdValidationError) {
            throw new Error("Course ID must be a valid ObjectId");
        }

        //^ Check if the course exists
        const courseExists = await Course.exists({ _id: course });

        //^ Return a 404 response if the course does not exist
        if (!courseExists) {
            throw new Error("Course not found");
        }

        //^ Check the main comment if it is a reply
        if (isItReply) {
            //^ validate the mainComment
            const { error: mainCommentError } = idValidator.validate({ id: mainComment });

            //^ Return a 400 response if there is a validation error
            if (mainCommentError) {
                throw new Error("Main Comment ID must be a valid ObjectId");
            }

            //^ Check if the mainComment exists
            const mainCommentExists = await Comment.exists({ _id: mainComment });

            //^ Return a 404 response if the mainComment does not exist
            if (!mainCommentExists) {
                throw new Error("Main Comment not found");
            }
        }

        //^ Create comment test data
        const commentSample = {
            body,
            course,
            creator,
            rate,
            isItReply,
            mainComment,
        };

        //^ Validate the comment data
        const { error: commentValidationError, value: validatedComment } = commentValidator.validate(commentSample);

        //^ Return a 400 response if there is a validation error
        if (commentValidationError) {
            throw new Error(commentValidationError);
        }

        //^ Create a new comment
        const comment = new Comment(validatedComment);

        //^ Save the comment to the database
        await comment.save();

        //^ Return a 201 response if the comment is successfully created
        return res.status(201).json({ message: "Comment created successfully" });
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getComments = async (req, res) => {
    try {
        //^ Get all comments from the database
        const comments = await Comment
            .find({}, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate("course", { title: 1 })
            .populate("creator", { password: 0, createdAt: 0, updatedAt: 0, __v: 0 });

        //^ Return a 200 response with the comments
        return res.status(200).json(comments);
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getComment = async (req, res) => { };

const deleteComment = async (req, res) => { };

export { createComment, getComments, getComment, deleteComment };