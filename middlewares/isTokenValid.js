import jwt from "jsonwebtoken";

const isTokenValid = (req, res, next) => {
    try {
        //^ Get the access token from request.accessToken
        const accessToken = req.accessToken;

        //^ Verify the access token
        jwt.verify(accessToken, process.env.JWT_SECRET, (error, decoded) => {

            //^ Return a 403 response if the access token is invalid
            if (error) {
                return res.status(403).json({ error: "Invalid access token" });
            }

            //^ Set the user ID in the request object
            req.userId = decoded.userId;

            //^ Call the next middleware
            next();
        });
    }
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default isTokenValid;