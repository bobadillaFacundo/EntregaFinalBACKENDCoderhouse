import carts from "./routers/carts.router.js"
import products from "./routers/products.router.js"
import express from "express"
import engine from "express-handlebars"
import __dirname from './utils.js'
import path from "path"

const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/products', products); // Monta el router de usuarios en /api/users
app.use('/api/carts', carts)
app.engine("handlebars", engine.engine())
app.set("view engine", "handlebars")
app.set("views", __dirname + "/views")
app.use(express.static(__dirname + "/public"))
app.use('/css', express.static(path.join(__dirname, 'public', 'css'), {
    // Configuración adicional para definir el tipo MIME de manera explícita
    setHeaders: (res, filePath) => {
        const contentType = mime.getType(filePath) || 'text/plain';
        res.setHeader('Content-Type', contentType);
    }
}))

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
})


