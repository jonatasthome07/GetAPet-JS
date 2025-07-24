import Pets from "../models/Pets.js"
import getToken from "../helpers/getToken.js"
import getUserByToken from "../helpers/getUserByToken.js"

export default class PetController {
    static async create (req,res){
        const {name, age, weight, color} = req.body
        let available = true

        if (!name){
            return res.status(422).json({message: "O nome é um campo obrigatório"})
        }
        if (!age){
            return res.status(422).json({message: "A idade é um campo obrigatório"})
        }
        if (!weight){
            return res.status(422).json({message: "O peso é um campo obrigatório"})
        }
        if (!color){
            return res.status(422).json({message: "A cor é um campo obrigatório"})
        }
       
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pet = new Pets({name, age, weight, color, available, images:[], user:{
            _id: user._id,
            name: user.name,
            image: user.image,
            phone: user.phone
       }})

        try {
            const newPet = await pet.save()
            res.status(201).json({message: "Pet cadastrado com sucesso!", newPet})
        } catch (error) {
            res.status(500).json({message: error})
        }

    }
}