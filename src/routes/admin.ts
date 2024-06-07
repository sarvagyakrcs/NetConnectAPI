import express from "express"
const router = express.Router();

import db from "../utils/prisma";
const prisma = db;

router.get("/users", async (req, res) => {
    try {
        // TODO : Implement Pagination
        const page = req.query.page;
        const limit = req.query.limit;

        const users = await prisma.user.findMany();

        res.json({
            users
        });
    } catch (error) {
        return res.status(500).json({
            "error": "Something Went Wrong!"
        });
    }
}); 

module.exports = router