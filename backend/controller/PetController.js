import Pets from "../models/Pets.js"

export default class PetController {
    static async create (req,res){
        res.status(201).json({message: "Criado!"})
    }
}