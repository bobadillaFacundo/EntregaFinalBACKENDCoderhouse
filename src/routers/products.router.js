import express from "express"
import { obtenerTodosLosDocumentos, obtenerDocumento, deleteDocumento, error } from "../utils.js"
import porductsModel from '../models/products.js'
import mongoose from 'mongoose'
import __dirname from "../utils.js"


const router = express.Router()
router.use(express.static(__dirname + "/public"))

router.get('/', async (req, res) => {
    let page = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    if (page > 0) {
        try {
            await mongoose.connect(process.env.MONGO_DB_URL)
            let result = await porductsModel.paginate({}, { page, limit, lean: true })
            result.prevLink = result.hasPrevPage ? `http://localhost:8080/api/products?page=${result.prevPage}` : ''
            result.nextLink = result.hasNextPage ? `http://localhost:8080/api/products?page=${result.nextPage}` : ''
            result.isValid = !(page <= 0 || page > result.totalPages)
            console.log(result.isValid)
            return res.render('productsFilter', {
                style: 'indexProducts.css',
                result
            })
        } catch (error) {
            console.error(`Server Error: ${error}`);
            return res.send(`Error del servidor: ${error}`)
        }
        finally {
            await mongoose.connection.close(); // Cerrar la conexión cuando termine
            console.log('Conexión cerrada correctamente en get product');
        }
    }
    await obtenerTodosLosDocumentos(process.env.MONGO_DB_URL, porductsModel).then(result => {
        return res.render('indexProducts', {
            style: 'indexProducts.css',
            products: result
        })
    }).catch(error => {
        error(res, `Error del servidor: ${error}`)
    })
})

router.post("/", (async (req, res) => {
    const user = req.body
    if (!user.title || !user.description || !user.code || !user.stock || !user.category || !user.price) {
        return error(res, `Campos Vacios`)

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
        error(res, `Error del servidor: ${error}`)
    } finally {
        await mongoose.connection.close(); // Cerrar la conexión cuando termine
        console.log('Conexión cerrada correctamente en post');
    }
}))

router.get("/:pid", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
        return error(res, `Error del servidor: ID no Existe`)
    }
    await obtenerDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel)
        .then(result => {
            if (!result) {
                return error(res, `Error del servidor: ID no Existe`)
            }
            return res.render('productsList', {
                style: 'indexProducts.css',
                products: result
            })
        })
        .catch(error => {
            error(res, `Error del servidor: ${error}`)
        })
})

router.delete("/:pid", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
        return error(res, `Error del servidor: ID no Existe`)
    }
    await deleteDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel).then(result => {
        if (result.deletedCount === 0) {
            return error(res, `Error del servidor: ID no Existe`)
        }
        return res.send({ status: "success", message: "Product delete" })
    }).catch(error => {
        error(res, `Error del servidor: ${error}`)
    })
})

router.put("/:pid", async (req, res) => {
    const user = req.body
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
        return error(res, `Error del servidor: ID no Existe`)
    }

    await obtenerDocumento(req.params.pid, process.env.MONGO_DB_URL, porductsModel).then(async result => {
        if (result.deletedCount === 0) {
            return error(res, `Error del servidor: ID no Existe`)
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
                return error(res, `Error producto no encontrado`)
            }
            obtenerTodosLosDocumentos(process.env.MONGO_DB_URL, porductsModel).then(result => {
                return res.render('putProducts', {
                    style: 'indexProducts.css',
                    products: result
                })
            }).catch(error => {
                error(res, `Error del servidor: ${error}`)
            })

        } catch (error) {
            console.error('Error en el Put Products', error)
            error(res, `Error del servidor: ${error}`)
        } finally {
            await mongoose.connection.close(); // Cerrar la conexión cuando termine
            console.log('Conexión cerrada correctamente en put product');
        }
    }).catch(error => {
        error(res, `Error del servidor: ${error}`)
    })


})


export default router