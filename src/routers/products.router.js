import express from "express"
import { obtenerTodosLosDocumentos, obtenerDocumento, deleteDocumento } from "../utils.js"
import porductsModel from '../models/products.js'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', {})
})

router.get("/products", (req, res) => {
    if (req.query.limit) {
        if (req.query.limit > (products.length + 1))
            return res.status(404).send({ status: "success", error: "numero mayor a la cantidad de productos" })

        let resultado = products.slice(0, req.query.limit);
        return res.json(resultado)
    }
    obtenerTodosLosDocumentos(process.env.MONGO_DB_URL).then(result => {
        return res.json(result)
    }).catch(error => {
        res.status(500).send({ status: "success", error: `${error}` })
    })
})

router.post("/", (async (req, res) => {
    const user = req.body
    if (!user.title || !user.description || !user.code || !user.stock || !user.category || !user.price)
        return res.status(400).send({ status: "success", error: "Campos vacios" })

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
    } catch (err) {
        console.error('Error al insertar documento', err)
        return res.status(500).send({ status: "success", error: `${error}` })
    } finally {
        await mongoose.connection.close(); // Cerrar la conexión cuando termine
        console.log('Conexión cerrada correctamente en obtenerDocumento');
    }
}))

router.get("/:pid", (req, res) => {
    obtenerDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel).then(result => {
        if (!result) {
            return res.status(404).send({ status: "success", error: "id no existe" })
        }
        return res.json(result)
    }).catch(error => {
        res.status(500).send({ status: "success", error: `${error}` })
    })
})

router.delete("/:pid", (req, res) => {
    deleteDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel).then(result => {
        if (result.deletedCount === 0) {
            return res.status(400).send({ status: "success", error: "id no existe" })
        }
        return res.send({ status: "success", message: "Product delete" })
    }).catch(error => {
        res.status(500).send({ status: "success", error: `${error}` })
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
        res.status(200).json({ status: "success", message: "Producto actualizado exitosamente", data: savedProduct });
    } catch (error) {
        console.error('Error en el Put', error)
        return res.status(500).send({ status: "success", error: `${error}` })
    } finally {
        await mongoose.connection.close(); // Cerrar la conexión cuando termine
        console.log('Conexión cerrada correctamente en put product');
    }
})


export default router