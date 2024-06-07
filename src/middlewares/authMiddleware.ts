// import { Request, Response , NextFunction } from "express";

// const jwt = require("jwt");
// const SECRET_KEY = process.env.AUTH_SECRET

// const verifyToken = (req: Request, res: Response, next: NextFunction) => {
//     const token = req.header("Authorization") || req.header("Bearer");
//     if(!token){
//         return res.status(401).json({
//             error: "Access Denied"
//         })
//     }

//     const decoded = jwt.verify(token, SECRET_KEY)
//     req.user
// }