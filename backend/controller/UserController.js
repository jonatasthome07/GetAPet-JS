import User from "../models/User.js"

export default class UserController {
    static async register(req,res){
        res.json({message: "Olá get a pet!"})
    }
}