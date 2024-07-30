import express from "express"
import { obtenerTodosLosDocumentos, obtenerDocumento, deleteDocumento, ERROR } from "../utils.js"
import cartsModel from '../models/carts.js'
import __dirname from "../utils.js"
import dotenv from 'dotenv'
import productsModel from '../models/products.js'
dotenv.config();

const router = express.Router()
router.use(express.static(__dirname + "/public"))

router.get('/', async (req, res) => {
    await obtenerTodosLosDocumentos(process.env.MONGO_DB_URL, cartsModel).then(result => {
        if (!req.query.principal) {
            return res.render('carts', {
                style: 'indexCarts.css',
                carts: result
            })
        } else return res.json(result)
    }).catch(error => {
        ERROR(res, `Error del servidor: ${error}`)
    })
})

router.get("/:cid", async (req, res) => {
    try {
        const result = await obtenerDocumento(req.params.cid, process.env.MONGO_DB_URL, cartsModel);

        if (!result) {
            return ERROR(res, `Error del servidor: ID no Existe`);
        }
         
        await result.populate('products._id')
        result.save

        return res.render('cartsList', {
            style: 'indexCarts.css',
            carts: result
        }) 
       
    } catch (error) {
        ERROR(res, `Error del servidor: ${error}`);
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        // Obtener el carrito por ID
        const carrito = await obtenerDocumento(req.params.cid, process.env.MONGO_DB_URL, cartsModel);
        if (!carrito) {
            return ERROR(res, 'Error del servidor: ID del carrito no existe')
        }

        // Obtener el producto por ID
        const producto = await obtenerDocumento(req.params.pid, process.env.MONGO_DB_URL, productsModel);
        if (!producto) {
            return ERROR(res, 'Error del servidor: ID del producto no existe')
        }

        const x = carrito.products.find(a => a._id.toString() === producto._id.toString())

        if (x) {
            x.cantidad = x.cantidad + parseInt(req.query.numberProducts)
        } else carrito.products.push({ _id: producto._id, cantidad: parseInt(req.query.numberProducts) })

        await carrito.save()

        res.json({ carrito })
    } catch (error) {
        ERROR(res, `Error del servidor: ${error.message}`)
    }
})

router.post("/", async (req, res) => {
    const newCarts = new cartsModel({
        products: []
    })
    try {
        const savedCarts = await newCarts.save()
        res.render('cartsPost', {
            style: 'indexCarts.css',
            carts: savedCarts
        })
    } catch (error) {
        console.error(`Error al insertar documento, ${error}`)
        ERROR(res, `Error del servidor: ${error}`)}
})

router.delete("/:cid", async (req, res) => {
    await deleteDocumento(req.params.cid, process.env.MONGO_DB_URL, cartsModel).then(result => {
        if (result.deletedCount === 0) {
            return ERROR(res, `Error del servidor: ID no Existe`)
        }
        return res.send("Carts delete")
    }).catch(error => {
        ERROR(res, `Error del servidor: ${error}`)
    })
})

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        // Obtener el carrito por ID
        let carrito = await obtenerDocumento(req.params.cid, process.env.MONGO_DB_URL, cartsModel);
        if (!carrito) {
            return ERROR(res, 'Error del servidor: ID del carrito no existe')
        }

        // Obtener el producto por ID
        const producto = await obtenerDocumento(req.params.pid, process.env.MONGO_DB_URL, productsModel);
        if (!producto) {
            return ERROR(res, 'Error del servidor: ID del producto no existe')
        }
        let x = await carrito.products.filter(a => a._id.toString() !== producto._id.toString())

        carrito.products = x

        await carrito.save()

        res.json({ carrito })
    } catch (error) {
        ERROR(res, `Error del servidor: ${error.message}`)
    }
})
export default router