const isTokenReceived = (req, res, next) => {
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
};

export default isTokenReceived;