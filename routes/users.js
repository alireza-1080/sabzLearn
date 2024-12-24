import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.post("/ban/:id", async (req, res) => {
    try {
        //^ Get the user id from the request parameters
        const id = req.params.id;

        //^ Find the user by id
        const user = await User.findById(id);

        //^ Return a 404 response if the user is not found
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        //^ Ban the user
        user.isBan = true;

        //^ Save the user
        await user.save();

        //^ Return a 200 response if the user is banned successfully
        return res.status(200).json({ message: "User banned successfully" });
    }
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post("/unban/:id", async (req, res) => {
    try {
        //^ Get the user id from the request parameters
        const id = req.params.id;

        //^ Find the user by id
        const user = await User.findById(id);

        //^ Return a 404 response if the user is not found
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        //^ Unban the user
        user.isBan = false;

        //^ Save the user

        await user.save();

        //^ Return a 200 response if the user is unbanned successfully

        return res.status(200).json({ message: "User unbanned successfully" });

    }
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
);

export default router;