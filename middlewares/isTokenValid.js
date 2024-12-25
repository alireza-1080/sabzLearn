const isTokenValid = (req, res, next) => {
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

export default isTokenValid;