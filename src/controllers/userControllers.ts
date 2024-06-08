import {Request, Response} from "express"
import { get_user_by_email, get_user_id_by_email, get_user_id_by_username } from "../utils/data/users";
import db from "../utils/prisma";
import bcrypt from "bcrypt" 
import * as z from "zod"
import { userLoginSchema, userRegisterSchema } from "../utils/schemas/user_schemas";
import { generateRefreshToken, generateVerificationToken } from "../utils/tokens";
import { getRefreshTokenByEmail, getVerificationTokenByEmail } from "../utils/data/token";

/**
 * Prisma database import
 * @package ../utils/prisma
 * @param {Object} db - The Prisma database instance.
 */
const prisma= db;

/**
 * Registers a new user.
 * @async
 * @function register_user
 * @param {Request} req - The Express.js Request object.
 * @param {Response} res - The Express.js Response object.
 * @returns {Promise<void>} - Resolves with success message and user data upon successful registration or appropriate error response.
 */
const register_user = async (req: Request, res: Response) => {
    const {
        user_name,
        password,
        email
    } = req.body;


    const req_user_data = {
        "user_name" : user_name,
        "password" : password,
        "email" : email
    }

    const { 
        success, 
        data 
    } = userRegisterSchema.safeParse(req_user_data)

    if(!success){
        return res.status(401).json({
            "error" : "Invalid Fields Provided.",
            "action" : "Please Provide correct fields and try again."
        })
    }
    const hashed_password = await bcrypt.hash(password, 10);


    const existing_user_username = await get_user_id_by_username(user_name);
    const existing_user_email = await get_user_id_by_email(email);
    
    if(existing_user_email || existing_user_username){
        return res.status(201).json({
            "error" : "User With Username or Email Already Exists."
        })
    }

    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashed_password,
            user_name: data.user_name
        }
    })

    res.json({
        "success": "User Created Successfully.",
        "user": user
    })
};

/**
 * Logs in a user.
 * @async
 * @function login_user
 * @param {Request} req - The Express.js Request object.
 * @param {Response} res - The Express.js Response object.
 * @returns {Promise<void>} - Resolves with success message and user data upon successful login or appropriate error response.
 */
const login_user = async(req: Request, res: Response) => {
    const {
        email,
        password
    } = req.query;

    const req_user_login_data = {
        "password" : password,
        "email" : email
    }

    const {
        success,
        data
    } = userLoginSchema.safeParse(req_user_login_data);

    if(!success){
        return res.status(401).json({
            "error" : "Invalid Fields Provided.",
            "action" : "Please Provide correct credentials and try again."
        })
    }

    //fetch user
    const existing_user = await get_user_by_email(data.email);
    if(!existing_user){
        return res.status(401).json({
            "error" : "User with Given Email ID not Found.",
            "action" : "Please Provide correct credentials and try again."
        })
    }
    if(!existing_user.password || !existing_user.email){
        return res.status(401).json({
            "error" : "Invalid Provider.",
            "action" : "Please Login Using Correct Provider."
        })
    }
    const password_match = await bcrypt.compare(data.password, existing_user.password);
    if(!password_match){
        return res.status(401).json({
            "error" : "Invalid Password.",
            "action" : "Please Provide correct credentials and try again."
        })
    }

    const access_token = await generateVerificationToken(existing_user.email);
    const refresh_token = await generateRefreshToken(existing_user.email);
    if(!access_token || !refresh_token){
        res.status(401).json({
            error: "Error in Generating Access Token.",
            action: "Please Try Again."
        })
    };

    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .cookie("accessToken", access_token, options)
        .cookie("refreshToken", refresh_token, options)
        .json({
            user: {
                email: existing_user.email,
                user_name: existing_user.user_name,
                image: existing_user.image
            }, 
            refresh_token, 
            access_token,
            message: "User Logged In Successfully"
        })
}   

interface CustomRequest extends Request {
    user?: any;
}

const logoutUser = async(req: CustomRequest, res: Response) => {
    const user = req.user;
    if(!user){
        return res.status(401).json({
            error: "Something Went Wrong"
        })
    }
    const existing_verification_token = await getVerificationTokenByEmail(user.email)
    const existing_refresh_token = await getRefreshTokenByEmail(user.email);

    if(!existing_refresh_token || !existing_refresh_token){
        return res.status(401).json({
            error: "Something Went Wrong"
        })
    }

    await prisma.refreshToken.delete({
        where: {
            id: existing_refresh_token.id
        }
    })

    await prisma.verificationToken.delete({
        where: {
            id: existing_verification_token.id
        }
    })

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json({
        message: "User Logged Out Successfully."
    })
}

module.exports = {
    register_user,
    login_user,
    logoutUser
}