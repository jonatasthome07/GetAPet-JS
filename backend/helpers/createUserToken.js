import jwt from "jsonwebtoken"

const createUserToken = async (user,req,res) => {
    
    //Crio um token enviando nome e id como payload e a signature
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.JWT_SECRET)

    res.status(200).json({message: "Você está autenticado!", token:token, userId:user._id})
}

export default createUserToken