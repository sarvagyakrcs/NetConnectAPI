import express,{  } from "express"
import { verifyJWT } from "../middlewares/authMiddleware"
const router = express.Router()

const controllers = require("../controllers/userControllers")

router.post("/register", controllers.register_user)

router.post("/login", controllers.login_user)

/**
 * Secured Routes
 */
router.post("/logout", verifyJWT, controllers.logoutUser)

module.exports = router