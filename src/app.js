import carts from "./routers/carts.router.js"
import products from "./routers/products.router.js"
import express from "express"
import engine from "express-handlebars"
import __dirname from './utils.js'
import path from "path"
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/products', products)
app.use('/api/carts', carts)
app.engine('handlebars', engine.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Permite acceso a propiedades heredadas
        allowProtoMethodsByDefault: true,    // Permite acceso a métodos heredados
    }
}))
app.set("view engine", "handlebars")
app.use(express.static(path.join(__dirname, 'public')))
app.set("views", __dirname + "/views")
app.use('/css', express.static(path.join(__dirname, 'public', 'css'), {
    // Configuración adicional para definir el tipo MIME de manera explícita
    setHeaders: (res, filePath) => {
        const contentType = mime.getType(filePath) || 'text/plain'
        res.setHeader('Content-Type', contentType)
    }
}))

mongoose.connect(process.env.MONGO_DB_URL).then(() => {
    console.log('Conectado a MongoDB')
}).catch(err => {
    console.error('Error de conexión a MongoDB:', err)
})

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})


