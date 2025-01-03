import Comment from "../models/comment.js";
import Course from "../models/course.js";
import User from "../models/user.js";
import commentValidator from "../validators/commentValidator.js";
import idValidator from "../validators/idValidator.js";
import { adminCommentValidator } from "../validators/commentValidator.js";

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
            .find({isApproved: true, isItReply: false}, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate("course", { title: 1 })
            .populate("creator", { password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('replies', { createdAt: 0, updatedAt: 0, __v: 0 });

        //^ Return a 200 response with the comments
        return res.status(200).json(comments);
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getComment = async (req, res) => {
    try {
        //^ Get the comment ID from the request parameters
        const { id } = req.params;

        //^ Validate the comment ID
        const { error: commentIdValidationError } = idValidator.validate({ id });

        //^ Return a 400 response if there is a validation error
        if (commentIdValidationError) {
            throw new Error("Comment ID must be a valid ObjectId");
        }

        //^ Find the comment by ID
        const comment = await Comment
            .findById(id, { createdAt: 0, updatedAt: 0, __v: 0 })
            .populate("course", { title: 1 })
            .populate("creator", { password: 0, createdAt: 0, updatedAt: 0, __v: 0 });

        //^ Return a 404 response if the comment does not exist
        if (!comment) {
            throw new Error("Comment not found");
        }

        //^ Return a 200 response with the comment
        return res.status(200).json(comment);
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        //^ Get the comment ID from the request parameters
        const { id } = req.params;

        //^ Validate the comment ID
        const { error: commentIdValidationError } = idValidator.validate({ id });

        //^ Return a 400 response if there is a validation error
        if (commentIdValidationError) {
            throw new Error("Comment ID must be a valid ObjectId");
        }

        //^ Delete the comment from the database
        const comment = await Comment.findByIdAndDelete(id);

        //^ Return a 404 response if the comment does not exist
        if (!comment) {
            throw new Error("Comment not found");
        }

        //^ Return a 200 response if the comment is successfully deleted
        return res.status(200).json({ message: "Comment deleted successfully" });
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const approveComment = async (req, res) => {
    try {
        //^ Get the comment id from the request parameters
        const { id } = req.params;

        //^ Validate the comment id
        const { error: commentIdValidationError } = idValidator.validate({ id });

        //^ Return a 400 response if there is a validation error
        if (commentIdValidationError) {
            throw new Error("Comment ID must be a valid ObjectId");
        }

        //^ Find the comment by id and update it
        const comment = await Comment.findByIdAndUpdate(id, { isApproved: true });

        //^ Return a 404 response if the comment is not found
        if (!comment) {
            throw new Error("Comment not found");
        }

        //^ Return a 200 response if the comment is successfully approved
        return res.status(200).json({ message: "Comment approved successfully" });
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const createAdminReply = async (req, res) => {
    try {
        //^ Get the comment id from the request parameters
        const { id: replyingCommentId } = req.params;

        //^ Validate the comment id
        const { error: replyingCommentIdValidationError } = idValidator.validate({ id: replyingCommentId });

        //^ Return a 400 response if there is a validation error
        if (replyingCommentIdValidationError) {
            throw new Error("Comment ID must be a valid ObjectId");
        }

        //^ Find the comment by id
        const replyingComment = await Comment.findById(replyingCommentId);

        //^ Return a 404 response if the comment is not found
        if (!replyingComment) {
            throw new Error("Comment not found");
        }

        //^ Get the course id from the replying comment
        const courseId = replyingComment.course.toString();

        //^ Get the admin id from the request object
        const adminId = req.userId;

        //^ Get the reply body from the request body
        const { body } = req.body;

        //^ Create the admin reply test data
        const adminReplySample = {
            body,
            course: courseId,
            creator: adminId,
            isItReply: true,
            mainComment: replyingCommentId,
        };

        //^ Validate the admin reply data
        const { error: adminReplyValidationError, value: validatedAdminReply } = adminCommentValidator.validate(adminReplySample);

        //^ Return a 400 response if there is a validation error
        if (adminReplyValidationError) {
            throw new Error(adminReplyValidationError);
        }

        //^ Add isApproved to the admin reply
        validatedAdminReply.isApproved = true;

        //^ Create a new admin reply
        const adminReply = new Comment(validatedAdminReply);

        //^ Save the admin reply to the database
        await adminReply.save();

        //^ Return a 201 response if the admin reply is successfully created
        return res.status(201).json({ message: "Admin reply created successfully" });
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export {
    createComment,
    getComments,
    getComment,
    deleteComment,
    approveComment,
    createAdminReply
};