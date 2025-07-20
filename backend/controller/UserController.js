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

    static async login(req,res){
        const {name, email, password} = req.body
        if(!name){
            return res.status(422).json({message: "Campo obrigatório!"})
        }
        if(!email){
            return res.status(422).json({message: "Campo obrigatório!"})
        }
        if(!password){
            return res.status(422).json({message: "Campo obrigatório!"})
        }

        const user = await User.findOne({email:email})
        if (!user){
            return res.status(422).json({message: "Usuário não encontrado!"})
        }

        const checkPass = await bcrypt.compare(password, user.password)
        if(!checkPass){
            return res.status(422).json({message: "Senha incorreta. Tente novamente!"})
        }

        //Criação do token com o usuário recém logado
        await createUserToken(user, req,res)
    }

    static async checkUser (req,res){
        let currentUser
        //Se o token veio pelo cabeçalho de autorizaçã no req
        if (req.headers.authorization){
            
        }
        else{
            currentUser = null
        }
        res.status(200).json(currentUser)
    }
}