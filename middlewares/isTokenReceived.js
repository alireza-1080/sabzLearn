

const isTokenReceived = (req, res, next) => {
    //^ Get the access token from the request headers
    const accessToken = req.header("Authorization").split(" ")[1];

    //^ Return a 403 response if the access token is not provided
    if (!accessToken) {
        return res.status(403).json({ error: "Access token not provided" });
    }

    //^ Set the access token in the request object
    req.accessToken = accessToken;

    //^ Call the next middleware
    next();
};

export default isTokenReceived;