import express from 'express';
import {controllerPostCart,
    controllerDeleteCart,
    controllerPostCartProduct,
    controllerGetCartProducts,
    controllerDeleteCartProduct,
    controllerSendCart} from '../controllers/controllerShoppingCart.js';
import { checkAuthentication } from '../controllers/controllerUsers.js';

const routerApiCart = express.Router()

routerApiCart.post('/shoppingcart', checkAuthentication, controllerPostCart)
routerApiCart.delete('/shoppingcart/:id_cart', checkAuthentication, controllerDeleteCart)
routerApiCart.delete('/sendshoppingcart/:id_cart', checkAuthentication, controllerSendCart)
routerApiCart.post('/shoppingcart/:id_cart/products', checkAuthentication, controllerPostCartProduct)
routerApiCart.get('/shoppingcart/:id_cart/products', checkAuthentication, controllerGetCartProducts)
routerApiCart.delete('/shoppingcart/:id_cart/products/:id_prod', checkAuthentication, controllerDeleteCartProduct)

export default routerApiCart