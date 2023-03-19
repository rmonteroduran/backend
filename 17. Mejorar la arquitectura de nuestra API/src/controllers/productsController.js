import { ProductsService } from '../services/productsService.js'
import { randomUUID as generarId } from 'crypto'
import logger from '../services/logger.js'

export async function postProduct(req, res, next) {
    try {
        const nuevoProducto = req
        nuevoProducto._id = generarId()
        const producto = await ProductsService.guardar(nuevoProducto)
        return producto
    } catch (error) {
        logger.error(error)
    }
}

export async function getProducts(req, res, next) {
    try {
        const products = await ProductsService.buscar()
        return products
    } catch (error) {
        logger.error(error)
    }
}