import mongoose from "mongoose"

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Conexão com mongoose!")
    } catch (error) {
        console.log(error)
    }
}

export default main