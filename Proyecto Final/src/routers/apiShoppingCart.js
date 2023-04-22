import express from 'express';
import {
    controllerPostCartProduct,
    controllerGetCartProducts,
    controllerDeleteCartProduct} from '../controllers/controllerShoppingCart.js';
import { checkAuthentication } from '../controllers/usersController.js';

const routerApiCart = express.Router()

routerApiCart.post('/shoppingcartproducts', checkAuthentication, controllerPostCartProduct)
routerApiCart.get('/shoppingcartproducts', checkAuthentication, controllerGetCartProducts)
routerApiCart.delete('/shoppingcartproducts/:id_prod', checkAuthentication, controllerDeleteCartProduct)

export default routerApiCart