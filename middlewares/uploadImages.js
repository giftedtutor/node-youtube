import multer from 'multer';
import uniqid from 'uniqid';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + uniqid() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });
export { upload }