import express,{  } from "express"
const router = express.Router()

const controllers = require("../controllers/user_controllers")

router.post("/register", controllers.register_user)

router.post("/login", controllers.login_user)

module.exports = router