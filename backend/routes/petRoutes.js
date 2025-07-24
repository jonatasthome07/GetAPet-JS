import express from "express"
const router = express.Router()
import PetController from "../controller/PetController.js"

//Middlewares
import verifyToken from "../helpers/verifyToken.js"
import imageUpload from "../helpers/imageUpload.js"

router.post("/create",verifyToken, imageUpload.array("images"), PetController.create)
router.get("/", PetController.getAll)

export default router
