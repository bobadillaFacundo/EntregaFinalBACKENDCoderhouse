import express from "express"
import { obtenerTodosLosDocumentos, obtenerDocumento, deleteDocumento, error } from "../utils.js"
import cartsModel from '../models/carts.js'
import __dirname from "../utils.js"
import mongoose from 'mongoose'

const router = express.Router()
router.use(express.static(__dirname + "/public"))

router.get('/',async(req,res)=>{
    await obtenerTodosLosDocumentos(process.env.MONGO_DB_URL,cartsModel).then(result => {
        return res.render('carts', {
            style: 'indexCarts.css',
            carts: result
        })
    }).catch(error => {
        error(res, `Error del servidor: ${error}`)
    })
})

router.get("/:cid",async (req, res) => {
    await obtenerDocumento(req.params.cid, process.env.MONGO_DB_URL, cartsModel)
    .then(result => {
        if (!result) {
            return error(res,`Error del servidor: ID no Existe`)
        }
        return res.render('cartsList', {
            style: 'indexCarts.css',
            carts: result
        })
    })
    .catch(error => {
        error(res, `Error del servidor: ${error}`)
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

router.post("/", async (req, res) =>  {
    const newCarts = new cartsModel({
        products: []
    })
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        const savedCarts = await newCarts.save()
        console.log(savedCarts)
        res.render('cartsList', {
            style: 'indexCarts.css',
            carts: savedCarts
        })
    } catch (error) {
        console.error(`Error al insertar documento, ${error}`)
        error(res, `Error del servidor: ${error}`)
    } finally {
        await mongoose.connection.close(); // Cerrar la conexión cuando termine
        console.log('Conexión cerrada correctamente');
    }
})

router.delete("/:cid", async (req, res) => {
    await deleteDocumento(req.params.cid, process.env.MONGO_DB_URL, cartsModel).then(result => {
        if (result.deletedCount === 0) {
            return error(res,`Error del servidor: ID no Existe`)
        }
        return res.send({ status: "success", message: "Carts delete" })
    }).catch(error => {
        error(res, `Error del servidor: ${error}`)
    })
})


export default router