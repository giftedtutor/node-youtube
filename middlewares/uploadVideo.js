import multer from 'multer';
import uniqid from 'uniqid';
import path from 'path';

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: "./upload/videos",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});

const uploadVideoMW = multer({ storage });
export { uploadVideoMW }


