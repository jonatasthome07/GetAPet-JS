import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

//Helpers
import createUserToken from "../helpers/createUserToken.js"
import getToken from "../helpers/getToken.js"
import getUserByToken from "../helpers/getUserByToken.js"

export default class UserController {
    static async register(req,res){
        const {name, email, password, confirmpassword, phone} = req.body
        
        //Validations
        if(!name){
            return res.status(422).json({message: "Nome é um campo obrigatório!"})
        }
        if(!email){
            return res.status(422).json({message: "E-mail é um campo obrigatório!"})
        }
        if(!password){
            return res.status(422).json({message: "Senha é um campo obrigatório!"})
        }
        if(!confirmpassword){
            return res.status(422).json({message: "Contra-senha é um campo obrigatório!"})
        }
        if(!phone){
            return res.status(422).json({message: "Telefone é um campo obrigatório!"})
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
            return res.status(422).json({message: "Nome é um campo obrigatório!"})
        }
        if(!email){
            return res.status(422).json({message: "E-mail é um campo obrigatório!"})
        }
        if(!password){
            return res.status(422).json({message: "Senha é um campo obrigatório!"})
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
                console.log(decoded.name)
                
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

            //Valida o formato do id
            if (!mongoose.Types.ObjectId.isValid(id)) {
                 return res.status(400).json({ message: "ID inválido!" })
                }
            
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

    static async editUser (req,res){
        const token = getToken(req)
        const user = await getUserByToken(token)
        
        const {name, email, password, confirmpassword, phone} = req.body
        let image = ''
        
        //Multer já altera e salva de acordo com as configurações
        if (req.file){
            user.image = req.file.filename
        }

        if (!mongoose.Types.ObjectId.isValid(user._id)) {
            return res.status(400).json({ message: "ID inválido!" })
        }

        if(!name){
            return res.status(422).json({message: "Nome é um campo obrigatório!"})
        }

        user.name = name

        if(!email){
            return res.status(422).json({message: "E-mail é um campo obrigatório!"})
        }

        const userExists = await User.findOne({email:email})

        if (user.email != email && userExists){
            return res.status(422).json({message: "E-mail indisponível!"})
        }

        user.email = email

        if(!phone){
            return res.status(422).json({message: "Telefone é um campo obrigatório!"})
        }

        user.phone = phone

        if(password !== confirmpassword){
            return res.status(422).json({message: "Senha e confirmação de senha devem ser iguais!"})
        } else if (password === confirmpassword && password != null){
            const salt = await bcrypt.genSalt(12)
            const hashedPass = await bcrypt.hash(password, salt)
            user.password = hashedPass
        }

        try {
            const updatedUser = await User.findOneAndUpdate({_id:user._id}, {$set: user}, {new: true})
            res.status(200).json({message: "Usuário atualizado com sucesso!"})
        } catch (error) {
            return res.status(500).json({message: `${error}`})
        }
    }
}