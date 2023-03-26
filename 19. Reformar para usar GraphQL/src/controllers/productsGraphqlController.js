import { servicioDeProductos } from '../services/productsService/index.js'
import { randomUUID as generarId } from 'crypto'
import logger from '../services/logger.js'

export async function postProduct({ datos }) {
    try {
        const nuevoProducto = datos
        nuevoProducto._id = generarId()
        const producto = await servicioDeProductos.guardar(nuevoProducto)
        return producto
    } catch (error) {
        logger.error(error)
    }
}

export async function getProducts(args) {
    const {campo, valor} = args
    try {
        const products = await servicioDeProductos.buscar(campo, valor)
        return products
    } catch (error) {
        logger.error(error)
    }
}

export async function getProductId(args) {
    const { id } = args
    try {
        const products = await servicioDeProductos.buscarPorId(id)
        return products
    } catch (error) {
        logger.error(error)
    }
}

export async function delProduct({ id }) {
    try {
        const result = await servicioDeProductos.eliminar(id)
        return result
    } catch (error) {
        logger.error(error)
    }
}

export async function putProduct({ id, datos }) {
    try {
        const producto = await servicioDeProductos.actualizar(id, datos)
        return producto
    } catch (error) {
        logger.error(error)
    }
}