import mongoose from "mongoose";

const isIdValid = (req, res, next) => {
    //^ Get the user id from the request params
    const { id } = req.params;

    //^ Ceck if the user id is valid
    const isIdValid = mongoose.Types.ObjectId.isValid(id);

    //^ Return a 400 response if the user id is not valid
    if (!isIdValid) { return res.status(400).json({ error: "Invalid id" }); }

    //^ Add the user id to the request object
    req.userId = id;

    //^ Call the next middleware
    next();
}

export default isIdValid;