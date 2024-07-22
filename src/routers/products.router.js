import express from "express"
import {insertarUnElemento,obtenerTodosLosDocumentos,obtenerDocumento,deleteDocumento} from "../utils.js"

const router = express.Router()
const products = []

router.get("/", async (req, res) => {
    if (req.query.limit) {
        if (req.query.limit > (products.length + 1))
            return res.status(404).send({ status: "success", error: "numero mayor a la cantidad de productos" })

        let resultado = products.slice(0, req.query.limit);
        return res.json(resultado)
    }
    obtenerTodosLosDocumentos( process.env.MONGO_DB_URL,process.env.MONGO_DB,process.env.MONGO_COLLECTION_PRODUCTS).then(result=>{
       return res.json(result)
    }).catch(error=>{
        res.status(500).send({ status: "success", error: "ERROR BDD"})
    })  
})

router.get("/:pid", (req, res) => {
    obtenerDocumento(req.params.pid,process.env.MONGO_DB_URL,process.env.MONGO_DB,process.env.MONGO_COLLECTION_PRODUCTS).then(result=>{
        if (!result) {
            return res.status(404).send({ status: "success", error: "id no existe" })
        }
        return res.json(result)
     }).catch(error=>{
         res.status(500).send({ status: "success", error:  `${error}`})
     })  
})

router.post("/", ((req, res) => {
    const user = req.body
    if (!user.title || !user.description || !user.code || !user.stock || !user.category || !user.price)
        return res.status(400).send({ status: "success", error: "Campos vacios" })
    let id = Date.now()
    const product = {
        id,
        title: user.title,
        description: user.description,
        code: user.code,
        price: user.price,
        status: true,
        stock: user.stock,
        category: user.category,
        thumbnails: user.thumbnails || []
    }
    insertarUnElemento(product, process.env.MONGO_DB_URL,process.env.MONGO_DB,process.env.MONGO_COLLECTION_PRODUCTS)
    return res.send({ status: "success", message: "Product create" })
}))

router.put("/:pid", (req, res) => {
    const user = req.body
    const pid = parseInt(req.params.pid)
    const productIndex = products.findIndex(prod => prod.id === pid);

    if (productIndex === -1) {
        return res.status(404).send({ status: "success", error: "No se encontro id" })
    }

    products[productIndex].title = user.title || products[productIndex].title
    products[productIndex].description = user.description || products[productIndex].description
    products[productIndex].code = user.code || products[productIndex].code
    products[productIndex].price = user.price || products[productIndex].price
    products[productIndex].stock = user.stock || products[productIndex].stock
    products[productIndex].category = user.category || products[productIndex].category
    products[productIndex].thumbnails = user.thumbnails || products[productIndex].thumbnails;
    return res.send({ status: "success", message: "Product update" })

})

router.delete("/:pid", (req, res) => {
    const obcj = {
    _id: req.params.pid,
        id: "",
    title: "user.title",
    description: "user.description",
    code: "ser.code",
    price: "user.price",
    status: "true",
    stock: "user.stock",
    category: "user.category",
    thumbnails: []}
    deleteDocumento(obcj,process.env.MONGO_DB_URL,process.env.MONGO_DB,process.env.MONGO_COLLECTION_PRODUCTS).then(result=>{
        if (result.deletedCount===0) {
            return res.status(400).send({ status: "success", error: "id no existe" })
        }
        return res.send({ status: "success", message: "Product delete" })
     }).catch(error=>{
         res.status(500).send({ status: "success", error:  `${error}`})
     }) 
})

export default router