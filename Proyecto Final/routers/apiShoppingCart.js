import express from 'express';
import {controllerPostCart,
    controllerDeleteCart,
    controllerPostCartProduct,
    controllerGetCartProducts,
    controllerDeleteCartProduct} from '../controllers/controllerShoppingCart.js';

const routerApiCart = express.Router()

routerApiCart.post('/shoppingcart', controllerPostCart)
routerApiCart.delete('/shoppingcart/:id_cart', controllerDeleteCart)
routerApiCart.post('/shoppingcart/:id_cart/products', controllerPostCartProduct)
routerApiCart.get('/shoppingcart/:id_cart/products', controllerGetCartProducts)
routerApiCart.delete('/shoppingcart/:id_cart/products/:id_prod', controllerDeleteCartProduct)

export default routerApiCart