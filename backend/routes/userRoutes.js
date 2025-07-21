import express from "express"
import UserController from "../controller/UserController.js"
const router = express.Router()

router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/checkuser", UserController.checkUser)
router.get("/:id", UserController.getUserById)

export default router