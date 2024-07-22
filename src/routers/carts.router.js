import express from "express"

const router = express.Router()
let carts = []

router.get("/:cid", (req, res) => {
    const cart = carts.find(cart => cart.id === parseInt(req.params.cid))
    if (!cart) {
        return res.status(404).send({ status: "success", error: "id no existe" })
    }
    res.json(cart.products)
})

router.post("/:cid/product/:pid", (req, res) => {
    const cart = carts.find(cart => cart.id === parseInt(req.params.cid)) //controlar si hay cart
    if (!cart) return res.status(404).send({ status: "success", error: "No se encontro id cart" }) //pasa si no existe

    let product = products.find(pro => pro.id === parseInt(req.params.pid))//controlar si hay product
    if (!product) return res.status(404).send({ status: "success", error: "No product id no existe" })//si no existe)

    product = cart.products.find(pro => pro.id === parseInt(req.params.pid))//busca el producto mandado
    if (!product) {
        product = {
            id: parseInt(req.params.pid),
            quantity: 1
        }
        cart.products.push(product) //agrego producto
        return res.json(product)
    }
    product.quantity++ //incremento en uno el producto
    res.json(product)
})

router.post("/", (req, res) => {
    let id = Date.now() + 1
    const cart = {
        id,
        products: []
    }
    carts.push(cart)
    res.json({ status: "success", message: "Cart add" })
})

export default router