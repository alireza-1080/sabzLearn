import User from '../models/user.js';

const isAdmin = async (req, res, next) => {
    //^ Get the user id from the request object
    const userId = req.userId;

    //^ Find the user by id
    const user = await User.findById(userId);

    //^ Return a 403 response if the user is not an admin
    if (user.role !== "ADMIN") {
        return res.status(403).json({ error: "Unauthorized user" });
    }

    //^ Call the next middleware
    next();
}

export default isAdmin;