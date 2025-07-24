import multer from "multer"
import path from "path"

const imageStorage = multer.diskStorage({
    //Define em qual pasta será salva, dependendo da URL acessada
    destination: function (req,file,callback){
        let folder = ""
        if (req.baseUrl.includes("users")){
            folder = "users"
        } else if (req.baseUrl.includes("pets")){
            folder = "pets"
        }
        callback(null, `public/images/${folder}`)
    },
    //Define o nome do arquivo
    filename: function(req,file,callback){
        callback(null, Date.now() + String(Math.floor(Math.random() * 100)) + path.extname(file.originalname))
    }
})

const imageUpload = multer ({
    //Onde o arquivo será salvo
    storage: imageStorage,
    //Filtra os tipos de arquivos que podem ser salvos
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return callback(new Error("Formato de arquivo inválido!"))
        }
        callback(undefined, true)
    }
})

export default imageUpload