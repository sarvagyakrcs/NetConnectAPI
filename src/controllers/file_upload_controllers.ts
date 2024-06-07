/**
 * Express.js import
 * @package express
 * @param {Object} express - The Express.js module.
 * @param {Function} Request - The Request object from Express.js.
 * @param {Function} Response - The Response object from Express.js.
 * @param {Function} Application - The Application object from Express.js.
 */
import express, { Request, Response, Application } from 'express';

/**
 * User ID retrieval function import
 * @package ../utils/data/users
 * @param {Function} get_user_id_by_username - Function to retrieve user ID by username.
 * @param {Function} get_user_by_username - Function to retrieve user by username.
 */
import { get_user_by_username, get_user_id_by_username } from '../utils/data/users';

/**
 * File system module import
 * @package fs
 */
const fs = require("fs")

/**
 * Prisma database import
 * @package ../utils/prisma
 * @param {Object} db - The Prisma database instance.
 */
import db from '../utils/prisma';
import { get_file_by_path } from '../utils/data/file';

/**
 * Prisma database instance.
 * @const {Object}
 */
const prisma = db;

/**
 * Responds with a welcome message.
 * @param {Request} req - The Express.js Request object.
 * @param {Response} res - The Express.js Response object.
 */
const welcome = (req: Request, res: Response) => {
    res.json({
        "message": "Welcome to File Upload Functionality",
        "warning": "If Not Authenticated Please Authenticate in order to access more Routes."
    });
}

/**
 * Retrieve deleted files for a user.
 * @async
 * @function get_deleted_files
 * @param {Request} req - The Express.js Request object.
 * @param {Response} res - The Express.js Response object.
 * @returns {Promise<void>} - Resolves with the deleted files or appropriate error response.
 */
const get_deleted_files = async (req: Request, res: Response) => {
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
}

/**
 * Retrieve active files for a user.
 * @async
 * @function get_active_files
 * @param {Request} req - The Express.js Request object.
 * @param {Response} res - The Express.js Response object.
 * @returns {Promise<void>} - Resolves with the active files or appropriate error response.
 */
const get_active_files = async (req: Request, res: Response) => {
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
}

/**
 * Uploads a file.
 * @async
 * @function upload_file
 * @param {Request} req - The Express.js Request object.
 * @param {Response} res - The Express.js Response object.
 * @returns {Promise<void>} - Resolves with success or appropriate error response.
 */
const upload_file = async (req: Request, res:Response) => {
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
        fs.unlink(req.file.path, (err: Error | null) => {
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
}

/**
 * Deletes a file by its path.
 * @async
 * @function delete_file_by_path
 * @param {Request} req - The Express.js Request object.
 * @param {Response} res - The Express.js Response object.
 * @returns {Promise<void>} - Resolves with success or appropriate error response.
 */
const delete_file_by_path = async (req: Request, res: Response) => {
    const path = req.query.path;

    // Check if path is a string
    if (typeof path !== 'string') {
        return res.status(400).json({
            error: 'Invalid Path Provided!',
        });
    }

    try {
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

        // Delete the file
        fs.unlink(path, (err: Error | null) => {
            if (err) {
                console.log({
                    "Error in Deleting File": err
                });
            }
        });

        // Confirm deletion
        res.json({
            success: `File with path ${path} deleted successfully.`
        });
    } catch (error) {
        // Handle any errors from Prisma or file deletion
        console.error("Error deleting file:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

/**
 * Module exports
 * @module
 * @type {Object}
 */
module.exports = {
    get_deleted_files,
    get_active_files,
    delete_file_by_path,
    upload_file,
    welcome
}
