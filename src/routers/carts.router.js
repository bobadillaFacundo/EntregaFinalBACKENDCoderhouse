import express from "express"
import { obtenerTodosLosDocumentos, obtenerDocumento, deleteDocumento } from "../utils.js"
import cartsModel from '../models/carts.js'
import __dirname from "../utils.js"
import mongoose from 'mongoose'

const router = express.Router()
let carts = []
router.use(express.static(__dirname + "/public"))

router.get('/',(req,res)=>{
    obtenerTodosLosDocumentos(process.env.MONGO_DB_URL,cartsModel).then(result => {
        return res.render('carts', {
            style: 'indexCarts.css',
            carts: result
        })
    }).catch(error => {
        res.status(500).render('ERROR', {
            style: 'index.css',
            resultado: ` status: "error", message: Error del servidor: ${error}`
        })
    })
})

router.get("/:cid", (req, res) => {
    obtenerDocumento(req.params.pid, process.env.MONGO_DB_URL, cartsModel)
    .then(result => {
        if (!result) {
            return res.status(404).render('ERROR', {
                style: 'index.css',
                resultado: `Error del servidor: ID no Existe`
            })
        }
        return res.render('carts', {
            style: 'carts.css',
            products: result
        })
    })
    .catch(error => {
        res.status(500).render('ERROR', {
            style: 'index.css',
            resultado: `Error del servidor: ${error}`
        })
    })
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
})

export default router