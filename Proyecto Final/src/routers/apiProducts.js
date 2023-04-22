import express from 'express';
import {postProduct,
    getProducts,
    getProductId,
    putProduct,
    delProduct} from '../controllers/productsController.js';
import { adminCheck } from '../controllers/controllerAdmin.js';
    
const routerApiProducts = express.Router()

routerApiProducts.get('/products', getProducts)
routerApiProducts.get('/products/:id', getProductId)
routerApiProducts.post('/products', adminCheck, postProduct)
routerApiProducts.put('/products/:id', adminCheck, putProduct)
routerApiProducts.delete('/products/:id', adminCheck, delProduct)

export default routerApiProducts