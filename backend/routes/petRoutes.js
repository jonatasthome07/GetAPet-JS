import express from "express"
const router = express.Router()
import PetController from "../controller/PetController.js"

//Middlewares
import verifyToken from "../helpers/verifyToken.js"
import imageUpload from "../helpers/imageUpload.js"

//Em qual campo do banco de dados virá as imagens
router.post("/create",verifyToken, imageUpload.array("images"), PetController.create)
router.get("/", PetController.getAll)
router.get("/mypets", verifyToken, PetController.getAllUserPets)
router.get("/myadoptions", verifyToken, PetController.getAllUserAdoptions)
router.get("/:id", verifyToken, PetController.getPetById)

export default router
