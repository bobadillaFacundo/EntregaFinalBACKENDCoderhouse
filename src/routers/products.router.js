import express from "express"
import {obtenerTodosLosDocumentos,obtenerDocumento,deleteDocumento} from "../utils.js"
import porductsModel from '../models/products.js'
import mongoose from 'mongoose'

const router = express.Router()

router.get("/", async (req, res) => {
    if (req.query.limit) {
        if (req.query.limit > (products.length + 1))
            return res.status(404).send({ status: "success", error: "numero mayor a la cantidad de productos" })

        let resultado = products.slice(0, req.query.limit);
        return res.json(resultado)
    }
    obtenerTodosLosDocumentos(process.env.MONGO_DB_URL).then(result=>{
       return res.json(result)
    }).catch(error=>{
        res.status(500).send({ status: "success", error:`${error}`})
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
        mongoose.connect(process.env.MONGO_DB_URL)
        const savedPorduct = await newProduct.save()
        return res.json(savedPorduct)
    } catch (err) {
        console.error('Error al insertar documento', err)
        return res.status(500).send({ status: "success", error: "ERROR BDD" })
    } finally {
        mongoose.connection.close(); // Cerrar la conexión cuando termine
        console.log('Conexión cerrada correctamente en obtenerDocumento');
    }
}))

router.get("/:pid", (req, res) => {
    obtenerDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel).then(result=>{
        if (!result) {
            return res.status(404).send({ status: "success", error: "id no existe" })
        }
        return res.json(result)
     }).catch(error=>{
         res.status(500).send({ status: "success", error:  `${error}`})
     })  
})

router.delete("/:pid", (req, res) => {
    deleteDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel).then(result=>{
        if (result.deletedCount===0) {
            return res.status(400).send({ status: "success", error: "id no existe" })
        }
        return res.send({ status: "success", message: "Product delete" })
     }).catch(error=>{
         res.status(500).send({ status: "success", error:  `${error}`})
     }) 
})

// router.put("/:pid", (req, res) => {
//     const user = req.body
//     const pid = parseInt(req.params.pid)
//     const productIndex = products.findIndex(prod => prod.id === pid);

//     if (productIndex === -1) {
//         return res.status(404).send({ status: "success", error: "No se encontro id" })
//     }

//     products[productIndex].title = user.title || products[productIndex].title
//     products[productIndex].description = user.description || products[productIndex].description
//     products[productIndex].code = user.code || products[productIndex].code
//     products[productIndex].price = user.price || products[productIndex].price
//     products[productIndex].stock = user.stock || products[productIndex].stock
//     products[productIndex].category = user.category || products[productIndex].category
//     products[productIndex].thumbnails = user.thumbnails || products[productIndex].thumbnails;
//     return res.send({ status: "success", message: "Product update" })

// })



export default router