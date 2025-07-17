import User from "../models/User.js"

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
    }
}