const getToken = (req) => {
    const authHeader = req.headers.authorization
    if (!authHeader){
        return null
    }
    //Pego apenas o token no header
    const token = authHeader.split(" ")[1]
    return token
}

export default getToken