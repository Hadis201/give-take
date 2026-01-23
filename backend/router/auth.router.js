import { Router } from "express"
import { verifyUser } from "../middleware/auth_middleware.js"
import { loginUser, logoutUser, registerUser } from "../controller/auth.controller.js"

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", verifyUser, logoutUser)

export default router

