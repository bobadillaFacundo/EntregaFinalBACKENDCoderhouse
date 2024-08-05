import express from "express"
import { obtenerTodosLosDocumentos, obtenerDocumento, deleteDocumento, ERROR } from "../utils.js"
import cartsModel from '../models/carts.js'
import __dirname from "../utils.js"
import productsModel from '../models/products.js'

const router = express.Router()
router.use(express.static(__dirname + "/public"))


router.get('/principal', async (req, res) => {
    await obtenerTodosLosDocumentos(cartsModel).then(result => {
        res.render('carts', {
            style: 'indexCarts.css',
            carts: result
        })
    }).catch(error => {
        ERROR(res, `Error del servidor: ${error}`)
    })
})

router.get('/', async (req, res) => {
    await obtenerTodosLosDocumentos(cartsModel).then(result => {
        res.json(result)
    }).catch(error => {
        ERROR(res, `Error del servidor: ${error}`)
    })
})


router.get("/:cid", async (req, res) => {
    try {
        const result = await obtenerDocumento(req.params.cid, cartsModel)

        if (!result) {
            return ERROR(res, `Error del servidor: ID no Existe`)
        }

        await result.populate('products._id')
        result.save

        return res.render('cartsList', {
            style: 'indexCarts.css',
            carts: result
        })

    } catch (error) {
        ERROR(res, `Error del servidor: ${error}`)
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const carrito = await obtenerDocumento(req.params.cid, cartsModel)
        if (!carrito) {
            return ERROR(res, 'Error del servidor: ID del carrito no existe')
        }

        const producto = await obtenerDocumento(req.params.pid, productsModel)
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

    try {
        const newCarts = new cartsModel({
            products: []
        })
        const savedCarts = await newCarts.save()
  
        res.render('cartsPost', {
            style: 'indexCarts.css',
            carts: savedCarts
        })
    } catch (error) {
        console.error(`Error al insertar documento, ${error}`)
        ERROR(res, `Error del servidor: ${error}`)
    }
})

router.delete("/:cid", async (req, res) => {
    await deleteDocumento(req.params.cid, cartsModel).then(result => {
        if (result.deletedCount === 0) {
            return ERROR(res, `Error del servidor: ID no Existe`)
        }
        return res.json('Se elimino el carrito')
    }).catch(error => {
        ERROR(res, `Error del servidor: ${error}`)
    })
})

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        let carrito = await obtenerDocumento(req.params.cid, cartsModel)
        if (!carrito) {
            return ERROR(res, 'Error del servidor: ID del carrito no existe')
        }

        const producto = await obtenerDocumento(req.params.pid, productsModel)
        if (!producto) {
            return ERROR(res, 'Error del servidor: ID del producto no existe')
        }
        let x = await carrito.products.filter(a => a._id.toString() !== producto._id.toString())

        carrito.products = x

        await carrito.save()

        res.json('Se elimino el producto')
    } catch (error) {
        ERROR(res, `Error del servidor: ${error.message}`)
    }
})

export default router