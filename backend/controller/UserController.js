import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//Helpers
import createUserToken from "../helpers/createUserToken.js"
import getToken from "../helpers/getToken.js"

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

        try {
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
        } catch (error) {
            console.log(error)
        }
    }

    static async checkUser (req,res){
        let currentUser
        
        //Se o token veio pelo cabeçalho de autorizaçã no req
        if (req.headers.authorization){
            console.log("Authorization:", req.headers.authorization)
            
            try {
                const token = getToken(req)
                console.log("Token extraído:", token)
                
                //Caso for válido, retorna o payload inserido no .sign()
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                
                //Acessa o id do usuário
                currentUser = await User.findById(decoded.id)
                
                //Undefined na senha 
                currentUser.password = undefined    
            } catch (error) {
                console.log(error)
            }
        }
        else{
            currentUser = null
        }
        res.status(200).json({currentUser})
    }

        static async getUserById(req,res){
            const id = req.params.id
            
            try {
                
                //Busco o usuário no banco de dados, com seus dados menos a pass
                const user = await User.findById(id).select("-password")
                
                if (!user){
                return res.status(422).json({message: "Usuário não encontrado!"})
                }
                
                res.status(200).json({user})
            } catch (error) {
              console.log(error)  
            }
    }
}