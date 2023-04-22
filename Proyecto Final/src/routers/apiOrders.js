import express from 'express';
import {
    controllerGetOrders,
    controllerNewOrder} from '../controllers/controllerOrders.js';
import { checkAuthentication } from '../controllers/usersController.js';

const routerApiOrders = express.Router()

routerApiOrders.post('/orders', checkAuthentication, controllerNewOrder)
routerApiOrders.get('/orders', checkAuthentication, controllerGetOrders)

export default routerApiOrders