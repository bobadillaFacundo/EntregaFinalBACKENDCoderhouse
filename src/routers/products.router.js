import express from "express"
import { obtenerTodosLosDocumentos, obtenerDocumento, deleteDocumento, ERROR } from "../utils.js"
import porductsModel from '../models/products.js'
import mongoose from 'mongoose'
import __dirname from "../utils.js"
import cartsModel from '../models/carts.js'


const router = express.Router()
router.use(express.static(__dirname + "/public"))


router.get('/mostrar/:pid', async (req, res) => {
    const products = {
        _id: req.params.pid,
        title: req.query.title,
        description: req.query.description,
        code: req.query.code,
        price: req.query.price,
        status: req.query.status,
        stock: req.query.stock,
        category: req.query.category,
        thumbnails: req.query.thumbnails
    }
    if (products.status === 'false') {products.status = false }else {products.status = true}

    return res.render('productsList',{
            products: products})
})

router.get('/principal', async (req, res) => {
    await obtenerTodosLosDocumentos(porductsModel).then(result => {
        return res.render('indexProducts', {
            style: 'indexProducts.css',
            products: result
        })
    }).catch(error => {
        ERROR(res, `Error del servidor: ${error}`)
    })
})

router.get('/', async (req, res) => {
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
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
        })
    } catch (error) {
        console.error(`Server Error: ${error}`)
        return ERROR(res, `Error del servidor: ${error}`, '500')
    }
})

router.post("/", (async (req, res) => {
    const product = req.body
    if (!product.title || !product.description || !product.code || !product.stock || !product.category || !product.price) {
        return ERROR(res, `Campos Vacios`)
    }
    const newProduct = new porductsModel({
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        status: true,
        stock: product.stock,
        category: product.category,
        thumbnails: product.thumbnails || []
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

router.get('/buscar', async (req, res) => {
    await obtenerTodosLosDocumentos(porductsModel).then(result => {
        const texto = req.query.texto
        let comparar
        const buscar = req.query.buscar
        if (buscar !== 'categoria') {
            if (texto === 'true') { comparar = true } else {
                if (texto === 'false') { comparar = false } else { return ERROR(res, `No hay nada que Mostrar`) }
            }
        }

        let result2
        if (buscar === 'status') result2 = result.filter(a => a.status === comparar)
        if (buscar === 'categoria') result2 = result.filter(a => a.category === texto)

        if (!result2) return ERROR(res, `No hay nada que Mostrar`)

        return res.render('buscar', {
            style: 'indexProducts.css',
            products: result2
        })
    }).catch(error => {
        ERROR(res, `Error del servidor: ${error}`)
    })
})

router.get("/:pid", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
        return ERROR(res, `Error del servidor: ID no Existe`)
    }
    await obtenerDocumento(req.params.pid, porductsModel)
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

    await deleteDocumento(req.params.pid, porductsModel).then(async result => {
        if (result.deletedCount === 0) {
            return ERROR(res, `Error del servidor: ID no Existe`)
        }
        try {
            let carts = await obtenerTodosLosDocumentos(cartsModel)
            await Promise.all(carts.map(async (cart) => {
                cart.products = cart.products.filter(a => a._id.toString() !== req.params.pid.toString())
                await cart.save()
            }))
            return res.json({ status: "success", message: "Product delete" })
        } catch (error) {
            return ERROR(res, `Error del servidor: ${error}`)
        }
    }).catch(error => {
        ERROR(res, `Error del servidor: ${error}`)
    })
})

router.put("/", async (req, res) => {
    const product = req.body
    try {
        if (!mongoose.Types.ObjectId.isValid(product.id)) {
            return ERROR(res, "ID no es válido")
        } 
        if (!(product.id)){
            return ERROR(res, "Ingresar Id")
        }

        let result = await obtenerDocumento(product.id, porductsModel)

        if (!(result)) { return ERROR(res, "ID no es valido") }

        let status = product.status

        status = (status === 'false') ? false : (status === 'true') ? true : result.status


        const products = {
            title: product.title || result.title,
            description: product.description || result.description,
            code: product.code || result.code,
            price: product.price || result.price,
            status,
            stock: product.stock || result.stock,
            category: product.category || result.category,
            thumbnails: product.thumbnails || result.thumbnails
        }


        const savedProduct = await porductsModel.updateOne({ _id: product.id }, { $set: products })
        if (savedProduct.matchedCount === 0) {
            return ERROR(res, "Producto no encontrado")
        }

       const nuevaUrl = `/api/products/mostrar/${product.id}/?title=${products.title}&description=${products.description}&code=${products.code}&price=${products.price}&status=${products.status}&stock=${products.stock}&category=${products.category}&thumbnails=${products.thumbnails}`

        return res.redirect(nuevaUrl)
    } catch (error) {
        console.error('Error actualizando el producto:', error)
        return ERROR(res, 'Error del servidor', "500")
    }
})


export default router