import Pets from "../models/Pets.js"
import getToken from "../helpers/getToken.js"
import getUserByToken from "../helpers/getUserByToken.js"

export default class PetController {
    static async create (req,res){
        const {name, age, weight, color} = req.body
        const images = req.files
        
        let available = true

        if (!name){
            return res.status(422).json({message: "O nome é obrigatório"})
        }
        if (!age){
            return res.status(422).json({message: "A idade é obrigatória"})
        }
        if (!weight){
            return res.status(422).json({message: "O peso é obrigatório"})
        }
        if (!color){
            return res.status(422).json({message: "A cor é obrigatória"})
        }

        if (images.length === 0){
            return res.status(422).json({message: "A imagem é obrigatória"})
        }
       
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pet = new Pets({name, age, weight, color, available, images:[], user:{
            _id: user._id,
            name: user.name,
            image: user.image,
            phone: user.phone
       }})

       //Percorre o array de imagens e altera o nome
       images.map((image) => {
        pet.images.push(image.filename)
       })

        try {
            const newPet = await pet.save()
            res.status(201).json({message: "Pet cadastrado com sucesso!", newPet})
        } catch (error) {
            res.status(500).json({message: error})
        }

    }

    static async getAll(req,res){
        try {
            //Ordena pelo mais recente
            const pets = await Pets.find().sort("-createdAt")
            res.status(200).json({message: "Nossos pets: ", pets})
        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    static async getAllUserPets(req,res){
        const token = getToken(req)
        const user = await getUserByToken (token)
        
        try {
            //Ordena pelo mais recente
            const pets = await Pets.find({"user._id": user._id}).sort("-createdAt")
            res.status(200).json({pets})
        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    static async getAllUserAdoptions(req,res){
        const token = getToken(req)
        const user = await getUserByToken (token)
        
        try {
            //Ordena pelo mais recente
            const pets = await Pets.find({"adopter._id": user._id}).sort("-createdAt")
            res.status(200).json({pets})
        } catch (error) {
            res.status(500).json({message: error})
        }
    }
}