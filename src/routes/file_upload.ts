import express, { Request, Response, Application } from 'express';
const router = express.Router();
import multer = require('multer');
import fs from 'fs'
import db from '../utils/prisma';
import { get_user_by_username, get_user_id_by_email, get_user_id_by_username } from '../utils/data/users';
import { get_file_by_path } from '../utils/data/file';

/**
 * Prisma Client
 */
const prisma = db;

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
 * Endpoints
 */

/**
 * @route GET /
 * @description Welcome endpoint to confirm service is running
 * @returns {Object} JSON message
 */
router.get('/', (req: Request, res: Response) => {
    res.json({
        "message" : "Welcome to File Upload"
    })
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

/**
 * @route POST /
 * @description Upload a .har or .json file
 * @param {string} user_name - The username of the uploader
 * @param {string} access_token - Access token for verification (TODO)
 * @returns {Object} JSON message indicating success or failure
 */
router.post('/', upload, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { user_name, access_token } = req.body;

    if (!user_name) {
        return res.status(400).json({
            "error" : "Please Enter a Username"
        });
    }

    //TODO: Verify Access Token

    const user = await get_user_by_username(user_name);
    if (!user) {
        return res.status(401).json({
            "error": "Cannot Find User."
        });
    }

    const file = await prisma.files.create({
        data: {
            path: req.file.path,
            deleted: false,
            authorId: user.id
        }
    });
    if (!file) {
        fs.unlink(req.file.path, (err) => {
            console.log({
                "Error in Deleting File" : err
            });
        });
        return res.json({
            "success": "Something Went Wrong!"
        });
    }
    res.json({
        "success": "File Uploaded Successfully."
    });
});

/**
 * @route DELETE /
 * @description Delete a file by its path
 * @param {string} path - The path of the file to be deleted
 * @returns {Object} JSON message indicating success or failure
 */
router.delete('/', async (req, res) => {
    const path = req.query.path;

    // Check if path is a string
    if (typeof path !== 'string') {
        return res.status(400).json({
            error: 'Invalid Path Provided!',
        });
    }

    // Check if file with path exists
    const file = await get_file_by_path(path);
    if (!file) {
        return res.status(404).json({
            error: "No file found with the provided path."
        });
    }

    // Proceed to delete the file if it exists
    await prisma.files.update({
        where: {
            path: path
        },
        data: {
            deleted: true
        }
    });

    fs.unlink(path, (err) => {
        if(err){
            console.log({
                "Error in Deleting File" : err
            });
        }
    });

    // Confirm deletion
    res.json({
        success: `File with path ${path} deleted successfully.`
    });
});

/**
 * @route GET /active_files
 * @description Get all active (not deleted) files for a user
 * @param {string} username - The username to query active files for
 * @returns {Array} Array of active files
 */
router.get('/active_files', async (req, res) => {
    const username = req.query.username;
    // TODO: Zod validation for username
    // Check if username is a string
    if (typeof username !== 'string') {
        return res.status(400).json({
            error: 'Invalid Username Provided!',
        });
    }
    const user_id = await get_user_id_by_username(username);
    if (!user_id) {
        return res.status(404).json({
            error: 'No User Found!'
        });
    }
    const files = await prisma.files.findMany({
        where: {
            authorId: user_id,
            deleted: false
        }
    });
    res.json({ files });
});

/**
 * @route GET /deleted_files
 * @description Get all deleted files for a user
 * @param {string} username - The username to query deleted files for
 * @returns {Array} Array of deleted files
 */
router.get('/deleted_files', async (req, res) => {
    const username = req.query.username;
    // TODO: Zod validation for username
    // Check if username is a string
    if (typeof username !== 'string') {
        return res.status(400).json({
            error: 'Invalid Username Provided!',
        });
    }
    const user_id = await get_user_id_by_username(username);
    if (!user_id) {
        return res.status(404).json({
            error: 'No User Found!'
        });
    }
    const files = await prisma.files.findMany({
        where: {
            authorId: user_id,
            deleted: true
        }
    });
    res.json({ files });
})

module.exports = router;
