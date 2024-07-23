import express from "express"
import { obtenerTodosLosDocumentos, obtenerDocumento, deleteDocumento } from "../utils.js"
import porductsModel from '../models/products.js'
import mongoose from 'mongoose'
import __dirname from "../utils.js"


const router = express.Router()
router.use(express.static(__dirname + "/public"))

router.get('/', (req, res) => {
    obtenerTodosLosDocumentos(process.env.MONGO_DB_URL).then(result => {
        return res.render('indexProducts', {
            style: 'indexProducts.css',
            products: result
        })
    }).catch(error => {
        res.status(500).render('ERRORproducts', {
            style: 'index.css',
            resultado: ` status: "error", message: Error del servidor: ${error}`
        })
    })
})

router.post("/", (async (req, res) => {
    const user = req.body
    console.log(req.body)
    if (!user.title || !user.description || !user.code || !user.stock || !user.category || !user.price) {
        res.status(400).render('ERRORproducts', {
            style: 'index.css',
            resultado: `status: "success", error: "Campos vacios"`
        })
    }
    const newProduct = new porductsModel({
        title: user.title,
        description: user.description,
        code: user.code,
        price: user.price,
        status: true,
        stock: user.stock,
        category: user.category,
        thumbnails: user.thumbnails || []
    })
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        const savedPorduct = await newProduct.save()
        return res.send(savedPorduct)
    } catch (error) {
        console.error(`Error al insertar documento, ${error}`)
        res.status(500).render('ERRORproducts', {
            style: 'index.css',
            resultado: ` status: "error", message: Error del servidor: ${error}`
        })
    } finally {
        await mongoose.connection.close(); // Cerrar la conexión cuando termine
        console.log('Conexión cerrada correctamente en obtenerDocumento');
    }
}))

router.get("/:pid", (req, res) => {
    obtenerDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel)
        .then(result => {
            if (!result) {
                return res.status(404).render('ERRORproducts', {
                    style: 'index.css',
                    resultado: ` status: "error", message: Error del servidor: ID no Existe`
                })
            }
            return res.render('products', {
                style: 'index.css',
                products: result
            })
        })
        .catch(error => {
            res.status(500).render('ERRORproducts', {
                style: 'index.css',
                resultado: ` status: "error", message: Error del servidor: ${error}`
            })
        })
})

router.delete("/:pid", (req, res) => {
    deleteDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel).then(result => {
        if (result.deletedCount === 0) {
            return res.status(404).render('ERRORproducts', {
                style: 'index.css',
                resultado: ` status: "error", message: Error del servidor: ID no Existe`
            })
        }
        return res.send({ status: "success", message: "Product delete" })
    }).catch(error => {
        res.status(500).render('ERRORproducts', {
            style: 'index.css',
            resultado: ` status: "error", message: Error del servidor: ${error}`
        })
    })
})

router.put("/:pid", async (req, res) => {
    const user = req.body

    const products = {
        title: user.title,
        description: user.description,
        code: user.code,
        price: user.price,
        status: user.status,
        stock: user.stock,
        category: user.category,
        thumbnails: user.thumbnails || []
    }
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        const savedProduct = await porductsModel.updateOne({ _id: req.params.pid }, { $set: products })
        if (savedProduct.matchedCount === 0) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }

        return res.status(200).render('ProdcutPut', {
            style: 'index.css',
            resultado: savedProduct
        })

    } catch (error) {
        console.error('Error en el Put Products', error)
        res.status(500).render('ERRORproducts', {
            style: 'index.css',
            resultado: ` status: "error", message: Error del servidor: ${error}`
        })
    } finally {
        await mongoose.connection.close(); // Cerrar la conexión cuando termine
        console.log('Conexión cerrada correctamente en put product');
    }
})


export default router