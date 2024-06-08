// ------------------------------
// IMPORTS
// ------------------------------
import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';
const cookieParser = require("cookie-parser"); 


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
app.use(cookieParser())

// ------------------------------
// ROUTES
// ------------------------------

// Root Route
/**
 * @route GET /
 * @description Serve welcome message
 * @returns {Object} JSON object with welcome message
 */
// app.get('/', (req: Request, res: Response) => {
//     res.json({
//         message: 'Welcome to Express & TypeScript Server'
//     });
// });

app.get('/', function (req, res) {
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)
  
    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
  })

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
const usersRoutes = require("./routes/userRoutes");
app.use("/users", usersRoutes);

// File Upload Routes
const fileUploadRoutes = require("./routes/fileUploadRoutes");
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
