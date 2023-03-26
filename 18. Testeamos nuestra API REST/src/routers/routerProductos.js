import { Router } from 'express'
import { postProduct, getProducts, getProductId, delProduct, putProduct} from '../controllers/productsController.js'

export const routerProductos = Router()

routerProductos.delete('/:id', async (req, res) => {
    const { id } = req.params;
    res.send(await delProduct(id));
})

routerProductos.put('/:id', async (req, res) => {
    res.send(await putProduct(req))
})

routerProductos.post('/', async (req, res) => {
    res.send(await postProduct(req.body))
})

routerProductos.get('/:id', async (req, res) => {
    const { id } = req.params;
    res.send(await getProductId(id))
})

routerProductos.get('/', async (req, res) => {
    res.send(await getProducts())
})

