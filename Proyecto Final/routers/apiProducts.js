import express from 'express';
import {controllerGetProducts,
    controllerGetProductsId,
    controllerPostProducts,
    controllerPutProductsId,
    controllerDeleteProductsId} from '../controllers/controllerProducts.js';
import { adminCheck } from '../controllers/controllerAdmin.js';
    
const routerApiProducts = express.Router()

routerApiProducts.get('/products', controllerGetProducts)
routerApiProducts.get('/products/:id', controllerGetProductsId)
routerApiProducts.post('/products', adminCheck, controllerPostProducts)
routerApiProducts.put('/products/:id', adminCheck, controllerPutProductsId)
routerApiProducts.delete('/products/:id', adminCheck, controllerDeleteProductsId)

export default routerApiProducts