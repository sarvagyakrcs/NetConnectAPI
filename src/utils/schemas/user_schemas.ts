import * as z from "zod"

export const userRegisterSchema = z.object({
    "user_name": z.string().min(6, "Username must be at least 6 characters long"),
    "email": z.string().email(),
    "password": z.string().min(8, "Password must be at least 8 characters long."),
})

export const userLoginSchema = z.object({
    "email": z.string().email(),
    "password": z.string().min(1, "Password is Required"),
})