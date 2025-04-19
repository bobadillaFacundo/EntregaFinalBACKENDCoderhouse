import express from "express"
import { obtenerTodosLosDocumentos, obtenerDocumento, deleteDocumento, ERROR } from "../utils.js"
import productsModel from '../models/products.js'
import mongoose from 'mongoose'
import __dirname from "../utils.js"
import cartsModel from '../models/carts.js'


const router = express.Router()
router.use(express.static(__dirname + "/public"))


router.get('/mostrar', async (req, res) => {
    const products = {
        _id: req.query._id,
        title: req.query.title,
        description: req.query.description,
        code: req.query.code,
        price: req.query.price,
        status: req.query.status,
        stock: req.query.stock,
        category: req.query.category,
        thumbnails: req.query.thumbnails
    }
    if (products.status === 'false') { products.status = false } else { products.status = true }

    return res.render('productsList', {
        style: 'indexProducts.css',
        products: products
    })
})

router.get('/principal', async (req, res) => {
    let page =  1
    let limit = 10
 
    try {

        let result = await productsModel.paginate({}, {
            page,
            limit,
            lean: true
        })

        result.prevLink = result.hasPrevPage
            ? `http://localhost:8080/api/products?page=${result.prevPage}&limit=${result.limit}`
            : ''
        result.nextLink = result.hasNextPage
            ? `http://localhost:8080/api/products?page=${result.nextPage}&limit=${result.limit}`
            : ''
        result.isValid = !(page <= 0 || page > result.totalPages)
        

        return res.render('indexProducts', {
            style: 'indexProducts.css',
            result
        })
    } catch (error) {
        console.error(`Server Error: ${error}`)
        return ERROR(res, `Error del servidor: ${error}`, '500')
    }

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

        let result = await productsModel.paginate({}, {
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
    const newProduct = new productsModel({
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
    const texto = req.query.texto
    const buscar = req.query.buscar

    let result2
    if (buscar === 'status') {
        if (texto === 'true') {
            result2 = { status: true };
        } else if (texto === 'false') {
            result2 = { status: false };
        } else {
            return ERROR(res, `No hay nada que Mostrar`);
        }
    } else if (buscar === 'categoria') {
        result2 = { category: texto };
    } else {
        return ERROR(res, `No hay nada que Mostrar`);
    }

    const filter = await productsModel.aggregate([
        { $match: result2 }])


    if (filter.toString() === '') return ERROR(res, `No hay nada que Mostrar`)

    return res.render('buscar', {
        style: 'indexProducts.css',
        products: filter
    })
})

router.get("/:pid", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
        return ERROR(res, `Error del servidor: ID no Existe`)
    }
    await obtenerDocumento(req.params.pid, productsModel)
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

    await deleteDocumento(req.params.pid, productsModel).then(async result => {
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
        if (!(product.id)) {
            return ERROR(res, "Ingresar Id")
        }

        let result = await obtenerDocumento(product.id, productsModel)

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


        const savedProduct = await productsModel.updateOne({ _id: product.id }, { $set: products })
        if (savedProduct.matchedCount === 0) {
            return ERROR(res, "Producto no encontrado")
        }

        const nuevaUrl = `/api/products/mostrar?_id=${product.id}&title=${products.title}&description=${products.description}&code=${products.code}&price=${products.price}&status=${products.status}&stock=${products.stock}&category=${products.category}&thumbnails=${products.thumbnails}`

        return res.redirect(nuevaUrl)
    } catch (error) {
        console.error('Error actualizando el producto:', error)
        return ERROR(res, 'Error del servidor', "500")
    }
})


export default router