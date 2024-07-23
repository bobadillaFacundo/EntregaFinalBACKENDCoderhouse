import express from "express"
import { obtenerTodosLosDocumentos, obtenerDocumento, deleteDocumento } from "../utils.js"
import porductsModel from '../models/products.js'
import mongoose from 'mongoose'
import __dirname from "../utils.js"


const router = express.Router()
router.use(express.static(__dirname + "/public"))

router.get('/',async (req, res) => {
   await obtenerTodosLosDocumentos(process.env.MONGO_DB_URL,porductsModel).then(result => {
        return res.render('indexProducts', {
            style: 'indexProducts.css',
            products: result
        })
    }).catch(error => {
        res.status(500).render('ERROR', {
            style: 'index.css',
            resultado: ` status: "error", message: Error del servidor: ${error}`
        })
    })
})

router.post("/", (async (req, res) => {
    const user = req.body
    if (!user.title || !user.description || !user.code || !user.stock || !user.category || !user.price) {
        res.status(400).render('ERROR', {
            style: 'index.css',
            resultado: `Error: "Campos vacios"`
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
        const savedProduct = await newProduct.save()
        res.render('productsList', {
            style: 'indexProducts.css',
            products: savedProduct
        })
    } catch (error) {
        console.error(`Error al insertar documento, ${error}`)
        res.status(500).render('ERROR', {
            style: 'index.css',
            resultado: `Error del servidor: ${error}`
        })
    } finally {
        await mongoose.connection.close(); // Cerrar la conexión cuando termine
        console.log('Conexión cerrada correctamente en post');
    }
}))

router.get("/:pid",async (req, res) => {
    await obtenerDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel)
        .then(result => {
            if (!result) {
                return res.status(404).render('ERROR', {
                    style: 'index.css',
                    resultado: `Error del servidor: ID no Existe`
                })
            }
            return res.render('productsList', {
                style: 'indexProducts.css',
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

router.delete("/:pid", async (req, res) => {
    await deleteDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel).then(result => {
        if (result.deletedCount === 0) {
            return res.status(404).render('ERROR', {
                style: 'index.css',
                resultado: `Error del servidor: ID no Existe`
            })
        }
        return res.send({ status: "success", message: "Product delete" })
    }).catch(error => {
        res.status(500).render('ERROR', {
            style: 'index.css',
            resultado: `Error del servidor: ${error}`
        })
    })
})

router.put("/:pid", async (req, res) => {
    const user = req.body
    if(!mongoose.Types.ObjectId.isValid(req.params.pid)){
        return res.status(404).render('ERROR', {
            style: 'index.css',
            resultado: `Error del servidor: ID no Existe`
        })
    }
    
    await obtenerDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel).then(async result => {
        if (result.deletedCount === 0) {
            return res.status(404).render('ERROR', {
                style: 'index.css',
                resultado: `Error del servidor: ID no Existe`
            })
        }
        const products = {
            title: user.title || result.title,
            description: user.description || result.description,
            code: user.code || result.code,
            price: user.price || result.price,
            status: user.status || result.status,
            stock: user.stock || result.stock,
            category: user.category || result.category,
            thumbnails: user.thumbnails || result.thumbnails
        }
        try {
            await mongoose.connect(process.env.MONGO_DB_URL)
            const savedProduct = await porductsModel.updateOne({ _id: req.params.pid }, { $set: products })
            if (savedProduct.matchedCount === 0) {
                res.status(500).render('ERROR', {
                    style: 'index.css',
                    resultado: `Error producto no encontrado`
                })
            }
            obtenerTodosLosDocumentos(process.env.MONGO_DB_URL,porductsModel).then(result => {
                return res.render('putProducts', {
                    style: 'indexProducts.css',
                    products: result
                })
            }).catch(error => {
                res.status(500).render('ERROR', {
                    style: 'index.css',
                    resultado: `Error del servidor: ${error}`
                })
            })
    
        } catch (error) {
            console.error('Error en el Put Products', error)
            res.status(500).render('ERROR', {
                style: 'index.css',
                resultado: `Error del servidor: ${error}`
            })
        } finally {
            await mongoose.connection.close(); // Cerrar la conexión cuando termine
            console.log('Conexión cerrada correctamente en put product');
        }
    }).catch(error => {
        res.status(500).render('ERROR', {
            style: 'index.css',
            resultado: `Error del servidor: ${error}`
        })
    })

    
})


export default router