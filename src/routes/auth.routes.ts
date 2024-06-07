import express from "express"
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        "hello" : "hello"
    })
})

module.exports = router;