import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Conexão com mongoose!")
    } catch (error) {
        console.log(error)
    }
}
main()
export default mongoose