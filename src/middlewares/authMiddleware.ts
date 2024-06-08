import { Request, Response , NextFunction } from "express";
import db from "../utils/prisma";
const prisma = db;

const jwt = require("jsonwebtoken");
const AUTH_SECRET = process.env.AUTH_SECRET;

interface CustomRequest extends Request {
    user?: any;
}

export const verifyJWT = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({
                error: "Unauthorized Request."
            })
        }
    
        const decoded_token_information = jwt.verify(token.token, AUTH_SECRET);
    
        const existing_user = await prisma.user.findMany({
            where: {
                email: decoded_token_information?.email
            }
        })
    
        if(!existing_user){
            //TODO: Frontend Talks
            return res.status(401).json({
                error: "Invalid Access Token."
            })
        }
    
        req.user = existing_user;
        next();
    } catch (error) {
        return res.status(401).json({
            error: error ||  "Invalid Access Token.",
        })
    }
}