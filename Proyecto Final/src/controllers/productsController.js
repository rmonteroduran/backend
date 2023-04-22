import { servicioDeProductos } from '../services/productsService/index.js'
import logger from '../services/logger.js'
import { Product } from '../models/products.js'

export async function postProduct(req, res, next) {
    try {
        if (!req.body.name || !req.body.description || !req.body.price || !req.body.image) {
            logger.error(`Post product error: Faltan datos de ingreso`)
            res.status(401);
            res.json(`Post product error: Faltan datos de ingreso`)
        } else {
            const nuevoProducto = new Product(req.body)
            await servicioDeProductos.guardar(nuevoProducto.datos())
            .then(result => {
                res.json(result)
            })
        }
    } catch (err) {
        logger.error(`Post product error: ${err}`)
        res.status(500);
        res.json({message: err})
    }
}

export async function getProducts(req, res, next) {
    try {
        const products = await servicioDeProductos.buscar()
        res.json(products)
    } catch (err) {
        logger.error(`Get products error: ${err}`)
        res.status(500);
        res.json({mensaje: err})
    }
}

export async function getProductId(req, res, next) {
    try {
        const product = await servicioDeProductos.buscarPorId(req.params.id)
        if (product) {
            res.json(product)
        } else {
            logger.error(`Get product id error: No se encontró el producto con el id: ${req.params.id}`)
            res.status(404);
            res.json({message: `No se encontró el producto con el id: ${req.params.id}`});
        }
    } catch (err) {
        logger.error(`Get product by id error: ${err}`)
        res.status(500);
        res.json({mensaje: err})
    }
}

export async function delProduct(req, res, next) {
    try {
        const result = await servicioDeProductos.eliminar(req.params.id)
        if (result.deletedCount === 0) {
            logger.error(`Put product error: No se encontró el producto con el id: ${req.params.id}`)
            res.status(404);
            res.json({message: `No se encontró el producto con el id: ${req.params.id}`});
        } else {
            res.json(req.params.id)
        }
    } catch (err) {
        logger.error(`Delete products error: ${err}`)
        res.status(500);
        res.json({mensaje: err})
    }
}

export async function putProduct({body, params: {id}}, res, next) {
    try {
        const result = await servicioDeProductos.actualizar(id, body)
        if (result.modifiedCount === 0) {
            logger.error(`Put product error: No se encontró el producto con el id: ${id}`)
            res.status(404);
            res.json({message: `No se encontró el producto con el id: ${id}`});
        } else {
            res.json(body)           
        }
    } catch (err) {
        logger.error(`Put products error: ${err}`)
        res.status(500);
        res.json({mensaje: err})
    }
}