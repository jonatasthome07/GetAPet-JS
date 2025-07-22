import jwt from "jsonwebtoken"
import User from "../models/User.js"

const getUserByToken = async (token) =>{
    
    if (!token){
        throw new Error("Acesso negado!")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id
    const user = await User.findById({_id: userId})
    return user
}

export default getUserByToken