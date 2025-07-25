import mongoose from "../db/conn.js"
import { Schema } from "mongoose"

const User = mongoose.model("User", new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    image: {type: String},
    phone: {type: String, required: true}}, 
    //Cria "colunas" auxiliares: createdAt e updatedAt
    {timestamps:true}))

export default User