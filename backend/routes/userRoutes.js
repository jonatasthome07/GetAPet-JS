import express from "express"
import UserController from "../controller/UserController.js"
const router = express.Router()

//Middlewares
import verifyToken from "../helpers/verifyToken.js"
import imageUpload from "../helpers/imageUpload.js"

router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/checkuser", UserController.checkUser)
router.get("/:id", UserController.getUserById)
router.patch("/edit/:id", verifyToken, imageUpload.single("image"),UserController.editUser)

export default router