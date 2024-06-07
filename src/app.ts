// ------------------------------
// IMPORTS
// ------------------------------
import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';


// ------------------------------
// CONFIGURATION
// ------------------------------
dotenv.config();
const app: Application = express();
const port = process.env.PORT || 8000;

// ------------------------------
// VIEW ENGINE SETUP
// ------------------------------
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// ------------------------------
// MIDDLEWARE
// ------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------
// ROUTES
// ------------------------------

// Root Route
/**
 * @route GET /
 * @description Serve welcome message
 * @returns {Object} JSON object with welcome message
 */
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Welcome to Express & TypeScript Server'
    });
});

// Hello Route
/**
 * @route GET /hello
 * @description Render the home page
 * @returns {void}
 */
app.get('/hello', (req: Request, res: Response) => {
  res.render('home');
});

// ------------------------------
// MODULE ROUTES
// ------------------------------

// User Routes
const usersRoutes = require("./routes/user");
app.use("/users", usersRoutes);

// File Upload Routes
const fileUploadRoutes = require("./routes/file_upload");
app.use("/file_upload", fileUploadRoutes);

// Admin Routes
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

// Authentication Routes
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// ------------------------------
// SERVER INITIALIZATION
// ------------------------------
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
