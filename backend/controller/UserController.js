import User from "../models/User.js"
import bcrypt from "bcrypt"
import createUserToken from "../helpers/createUserToken.js"

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
            return res.status(422).json({message: "E-mail já cadastrado!"})
        }

        const salt = await bcrypt.genSalt(12)
        const hashedPass = await bcrypt.hash(password, salt)
        
        //Instancio um objeto do model e salvo em uma variável
        const user = new User({name, email, password:hashedPass, phone})

        try {
           //Método .save() na variável
            const newUser = await user.save()
            
            //Crio o token com o usuário recém criado
            await createUserToken(newUser, req,res)
        } catch (error) {
            res.status(500).json({message: error})
        }
    }
}