import express from "express"
const router = express.Router()
import PetController from "../controller/PetController.js"

router.post("/create", PetController.create)

export default router
