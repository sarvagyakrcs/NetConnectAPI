import express,{  } from "express"
import db from "../utils/prisma";
import { get_user_by_username, get_user_id_by_email, get_user_id_by_username } from "../utils/data/users";
const router = express.Router()
const prisma = db;

router.post("/register", async (req, res) => {
    const {
        user_name,
        password,
        email
    } = req.body;

    // TODO: Zod Validation

    const existing_user_username = await get_user_id_by_username(user_name);
    const existing_user_email = await get_user_id_by_email(email);
    
    if(existing_user_email || existing_user_username){
        return res.status(201).json({
            "error" : "User With Username or Email Already Exists."
        })
    }

    const user = await prisma.user.create({
        data: {
            email,
            password,
            user_name: user_name
        }
    })

    res.json({
        "success": "User Created Successfully.",
        "user": user
    })
})


module.exports = router