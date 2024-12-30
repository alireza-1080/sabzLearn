import multer from 'multer';
import path from 'path';
import { __dirname } from '../app.js';
import crypto from 'crypto';

//^ Set up the storage engine
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, 'public', 'sessions', 'videos'));
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(8).toString('hex');
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

//^ Set up the file filter
const fileFilter = (_req, file, cb) => {
    const allowedFileTypes = ['video/mp4', 'video/mpeg', 'video/ogg', 'video/quicktime', 'video/webm', 'video/x-ms-wmv', 'video/x-flv', 'video/x-msvideo', 'video/3gpp', 'video/3gpp2'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

//^ Set up the upload middleware
const sessionVideoUploader = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 100,    //^ 100 MB
    },
});

export default sessionVideoUploader;