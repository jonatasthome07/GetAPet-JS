import mongoose from "../db/conn.js"
import { Schema } from "mongoose"

const Pet = mongoose.model("Pet", new Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    weight: {type: Number, required: true},
    color: {type: String, required: true},
    images: {type: Array, required: true},
    available: {type: Boolean},
    //Cria relacionamento entre os bancos
    user: Object, 
    adopter: Object},
    //Cria "colunas" auxiliares: createdAt e updatedAt
    {timestamps:true}))

export default Pet