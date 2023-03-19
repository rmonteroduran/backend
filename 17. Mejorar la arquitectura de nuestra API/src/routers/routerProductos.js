import { Router } from 'express'
import { postProduct, getProducts} from '../controllers/productsController.js'

export const routerProductos = Router()

routerProductos.post('/', async (req, res) => {
    const nuevoProducto = req.body
    nuevoProducto._id = generarId()
    postProduct(nuevoProducto)
})

routerProductos.get('/', async (req, res) => {
    getProducts()
})