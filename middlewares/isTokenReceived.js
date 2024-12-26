const isTokenReceived = (req, res, next) => {
    try {
        //^ Get the access token from the request headers
        const requestHeader = req.header("Authorization");

        //^ Return a 403 response if the access token is not provided
        if (!requestHeader) {
            return res.status(403).json({ error: "Access token not provided" });
        }

        //^ Extract the access token from the request headers
        const accessToken = requestHeader.replace("Bearer ", "");

        //^ Set the access token in the request object
        req.accessToken = accessToken;

        //^ Call the next middleware
        next();
    }
    //^ Catch any error that occurs & return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export default isTokenReceived;