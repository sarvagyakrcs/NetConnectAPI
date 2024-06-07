import express, { Request, Response, Application } from 'express';
import db from '../utils/prisma';
const router = express.Router();
const controller = require("../controllers/file_upload_controllers")
const middlewares = require("../middlewares/file_upload_middlewares")

/**
 * Prisma Client
 */
const prisma = db;




/**
 * Endpoints
 */

/**
 * @route GET /
 * @description Welcome endpoint to confirm service is running
 * @returns {Object} JSON message
 */
router.get('/', controller.welcome);


/**
 * @route POST /
 * @description Upload a .har or .json file
 * @param {string} user_name - The username of the uploader
 * @param {string} access_token - Access token for verification (TODO)
 * @returns {Object} JSON message indicating success or failure
 */
router.post('/', middlewares.upload , controller.upload_file);

/**
 * @route DELETE /
 * @description Delete a file by its path
 * @param {string} path - The path of the file to be deleted
 * @returns {Object} JSON message indicating success or failure
 */
router.delete('/', controller.delete_file_by_path);

/**
 * @route GET /active_files
 * @description Get all active (not deleted) files for a user
 * @param {string} username - The username to query active files for
 * @returns {Array} Array of active files
 */
router.get('/active_files', controller.get_active_files);

/**
 * @route GET /deleted_files
 * @description Get all deleted files for a user
 * @param {string} username - The username to query deleted files for
 * @returns {Array} Array of deleted files
 */
router.get('/deleted_files', controller.get_deleted_files)

module.exports = router;
