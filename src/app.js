import carts from "./routers/carts.router.js"
import products from "./routers/products.router.js"
import express from "express"

const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/products', products); // Monta el router de usuarios en /api/users
app.use('/api/carts', carts)


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
})


