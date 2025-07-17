import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"

const app = express()

app.use(express.json())
app.use(express.static("public"))

//Permite o front se comunicar com o back, salvando sessões e enviando headers/tokens
app.use(cors({credentials:true, origin:process.env.CLIENT_URL}))

app.use("/users", userRoutes)

app.listen(process.env.PORT, ()=>{
    console.log("Conexão realizada com sucesso!")
})