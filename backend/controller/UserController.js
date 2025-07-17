import User from "../models/User.js"
import bcrypt from "bcrypt"

export default class UserController {
    static async register(req,res){
        const {name, email, password, confirmpassword, phone} = req.body
        
        //Validations
        if(!name){
            return res.status(422).json({message: "Campo obrigatório!"})
        }
        if(!email){
            return res.status(422).json({message: "Campo obrigatório!"})
        }
        if(!password){
            return res.status(422).json({message: "Campo obrigatório!"})
        }
        if(!confirmpassword){
            return res.status(422).json({message: "Campo obrigatório!"})
        }
        if(!phone){
            return res.status(422).json({message: "Campo obrigatório!"})
        }
        if(password !== confirmpassword){
            return res.status(422).json({message: "Senha e confirmação de senha devem ser iguais!"})
        }

        const checkUser = await User.findOne({email:email})
        if (checkUser){
            return res.status(422).json({message: "Usuário já existente!"})
        }

        const salt = await bcrypt.genSalt(12)
        const hashedPass = await bcrypt.hash(password, salt)
        //Instancio um objeto do model e salvo em uma variável
        const user = new User({name, email, password:hashedPass, phone})

        try {
           //Método .save() na variável
            const newUser = await user.save()
           res.status(201).json({message: "Usuário criado com sucesso!", newUser}) 
        } catch (error) {
           res.status(500).json({message: error})
        }
    }
}