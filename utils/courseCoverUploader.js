import multer from "multer";
import path from "path";
import { __dirname } from "../app.js";
import crypto from "crypto";

//^ Set up the storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "public", "courses", "covers"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(8).toString('hex');
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

//^ Set up the file filter
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//^ Set up the upload middleware
const courseCoverUploader = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2, //^ 2 MB
    },
});

export default coverUploader;

