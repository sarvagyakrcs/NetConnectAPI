import multer = require('multer');
const fs = require("fs")
import { Request } from 'express';

/**
 * Ensure the uploads directory exists
 */
const ensureUploadsDirectoryExists = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

/**
 * Configure Storage Engine and Filename
 * destination : ./uploads/temporary/
 * unique_filename : file.fieldname + '-' + Date.now()
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads/';
        ensureUploadsDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

/**
 * Initialize the upload Middleware and add file size limit
 */
const ONE_MB = 1000000;
const upload = multer({
    storage: storage,
    limits: {
        fileSize: ONE_MB * 100
    },
    fileFilter: (req: Request, file, cb) => {
        const allowedMimeTypes = ["application/json"];
        const allowedExtensions = [".har", ".json"];
        
        const fileExtension = file.originalname.slice((Math.max(0, file.originalname.lastIndexOf(".")) || Infinity) + 1);
        const isMimeTypeAllowed = allowedMimeTypes.includes(file.mimetype);
        const isExtensionAllowed = allowedExtensions.includes(`.${fileExtension}`);
        
        if (!isMimeTypeAllowed && !isExtensionAllowed) {
            cb(new Error("Please upload a .har or .json file."));
        }
        return cb(null, true);
    }
}).single("har-file")

module.exports = {upload}