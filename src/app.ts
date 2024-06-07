import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import multer = require('multer');
const fs = require("fs")

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.json({
        'message': 'Welcome to Express & TypeScript Server'
    });
});

app.get('/hello', (req: Request, res: Response) => {
    res.render('home')
})

//users and authentication
const users_routes = require("./routes/user")
app.use("/users", users_routes)

//file_upload
const file_upload_routes = require("./routes/file_upload");
app.use("/file_upload", file_upload_routes)

// admin
const admin_routes = require("./routes/admin")
app.use("/admin", admin_routes);

// authentication
const auth_routes = require("./routes/auth.routes")
app.use("/auth", auth_routes);


app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
