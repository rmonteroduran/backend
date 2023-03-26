import { servicioDeProductos } from '../services/productsService/index.js'
import { randomUUID as generarId } from 'crypto'
import logger from '../services/logger.js'

export async function postProduct(req, res, next) {
    try {
        const nuevoProducto = req
        nuevoProducto._id = generarId()
        const producto = await servicioDeProductos.guardar(nuevoProducto)
        return producto
    } catch (error) {
        logger.error(error)
    }
}

export async function getProducts(req, res, next) {
    try {
        const products = await servicioDeProductos.buscar()
        return products
    } catch (error) {
        logger.error(error)
    }
}

export async function getProductId(req, res, next) {
    try {
        const products = await servicioDeProductos.buscarPorId(req)
        return products
    } catch (error) {
        logger.error(error)
    }
}

export async function delProduct(req, res, next) {
    try {
        await servicioDeProductos.eliminar(req)
        return req
    } catch (error) {
        logger.error(error)
    }
}

export async function putProduct({body, params: {id}}, res, next) {
    try {
        const producto = await servicioDeProductos.actualizar(id, body)
        return producto
    } catch (error) {
        logger.error(error)
    }
}