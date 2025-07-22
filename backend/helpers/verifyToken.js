import jwt from "jsonwebtoken"
import getToken from "./getToken.js"

const verifyToken = (req,res,next) =>{
    
    const token = getToken(req)
    
    if (!req.headers.authorization || !token){
        return res.status(401).json({message: "Acesso negado!"})
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        
        //Acesso as mesmas clains definidas no .sign()
        req.user = verified
        next()
    } catch (error) {
        return res.status(400).json({message: "Token inválido"})
    }
}

export default verifyToken