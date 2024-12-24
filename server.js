//^ imports
import connectDB from "./configs/db.js";
import app from "./app.js";
import "dotenv/config";

//^ Set the port
const port = process.env.PORT || 5000;


//^ Connect to MongoDB
try {
    connectDB();
    console.log("MongoDB connected");
} catch (error) {
    console.error(error);
    process.exit(1);
}

//^ Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});