import User from '../models/user.js';

const isAdmin = async (req, res, next) => {
    try {

        //^ Get the user id from the request object
        const userId = req.userId;
        
        //^ Find the user by id
        const user = await User.findById(userId);

        //^ Return a 404 response if the user is not found
        if (!user) {
            return res.status(404).json({ error: "Sender id is not avaialble in database" });
        }
        
        //^ Return a 403 response if the user is not an admin
        if (user.role !== "ADMIN") {
            return res.status(403).json({ error: "Unauthorized user" });
        }
        
        //^ Call the next middleware
        next();
    } 
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default isAdmin;