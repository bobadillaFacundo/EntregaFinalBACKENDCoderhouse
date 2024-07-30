import express from "express"
import { obtenerTodosLosDocumentos, obtenerDocumento, deleteDocumento, ERROR } from "../utils.js"
import porductsModel from '../models/products.js'
import mongoose from 'mongoose'
import __dirname from "../utils.js"
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router()
router.use(express.static(__dirname + "/public"))

router.get('/', async (req, res) => {
    let page = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    let sort = req.query.sort
    let sortOption = {}
    let tipo = req.query.tipo


    if (tipo === 'category') {
        if (sort === "asc") {
            sortOption = { category: 1 }
        } else if (sort === "desc") {
            sortOption = { category: -1 }
        }
    }

    if (tipo === 'price') {
        if (sort === "asc") {
            sortOption = { price: 1 }
        } else if (sort === "desc") {
            sortOption = { price: -1 }
        }
    }

    if (page > 0) {
        try {

            let result = await porductsModel.paginate({}, {
                page,
                limit,
                lean: true,
                sort: sortOption
            })

            result.prevLink = result.hasPrevPage
                ? `http://localhost:8080/api/products?page=${result.prevPage}&limit=${result.limit}&sort=${result.sort}&tipo=${tipo}`
                : ''
            result.nextLink = result.hasNextPage
                ? `http://localhost:8080/api/products?page=${result.nextPage}&limit=${result.limit}&sort=${result.sort}&tipo=${tipo}`
                : ''
            result.isValid = !(page <= 0 || page > result.totalPages)
            result.sort = sort
            result.tipo = tipo 
            
            return res.render('productsFilter', {
                style: 'indexProducts.css',
                result
            });
        } catch (error) {
            console.error(`Server Error: ${error}`)
            return ERROR(res, `Error del servidor: ${error}`, '500')
        } finally {
            return
        }
    }
    await obtenerTodosLosDocumentos(process.env.MONGO_DB_URL, porductsModel).then(result => {
        return res.render('indexProducts', {
            style: 'indexProducts.css',
            products: result
        })
    }).catch(error => {
        ERROR(res, `Error del servidor: ${error}`)
    })
})

router.post("/", (async (req, res) => {
    const user = req.body
    if (!user.title || !user.description || !user.code || !user.stock || !user.category || !user.price) {
        return ERROR(res, `Campos Vacios`)
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
        const savedProduct = await newProduct.save()
        res.render('productsList', {
            style: 'indexProducts.css',
            products: savedProduct
        })
    } catch (error) {
        console.error(`Error al insertar documento, ${error}`)
        ERROR(res, `Error del servidor: ${error}`)
    } 
}))

router.get("/:pid", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
        return ERROR(res, `Error del servidor: ID no Existe`)
    }
    await obtenerDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel)
        .then(result => {
            if (!result) {
                return ERROR(res, `Error del servidor: ID no Existe`)
            }
            return res.render('productsList', {
                style: 'indexProducts.css',
                products: result
            })
        })
        .catch(error => {
            ERROR(res, `Error del servidor: ${error}`)
        })
})

router.delete("/:pid", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
        return ERROR(res, `Error del servidor: ID no Existe`)
    }
    
    await deleteDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel).then(result => {
        if (result.deletedCount === 0) {
            return ERROR(res, `Error del servidor: ID no Existe`)
        }
        return res.send({ status: "success", message: "Product delete" })
    }).catch(error => {
        ERROR(res, `Error del servidor: ${error}`)
    })
})

router.put("/:pid", async (req, res) => {
    const user = req.body
    try {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
        return ERROR(res, "ID no es válido")
    }

    let result = await obtenerDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel)

    if(!(result)) {return ERROR(res,"ID no es valido") }

    let status = user.status;

    if (status === 'false') {
        status = false;
    } else if (status === undefined) {
        status = result.status;
    }  
    const products = {
        title: user.title || result.title,
        description: user.description || result.description,
        code: user.code || result.code,
        price: user.price || result.price,
        status,
        stock: user.stock || result.stock,
        category: user.category || result.category,
        thumbnails: user.thumbnails || result.thumbnails
    }

    
        const savedProduct = await porductsModel.updateOne({ _id: req.params.pid }, { $set: products })
        if (savedProduct.matchedCount === 0) {
            return ERROR(res, "Producto no encontrado")
        }

        return res.render('productsPut', {
            style: 'indexProducts.css',
            prod: products,
            id: req.params.pid 
        })
    } catch (error) {
        console.error('Error actualizando el producto:', error)
        return ERROR(res, 'Error del servidor', "500")
    } 
})


export default router