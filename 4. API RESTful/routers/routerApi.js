const express = require('express');
const {controladorDeleteProductosSegunId,
    controladorGetProductos,
    controladorGetProductosSegunId,
    controladorPostProductos,
    controladorPutProductosSegunId} = require('../controllers/controllerProductos');
    
const routerApi = express.Router()

routerApi.get('/productos', controladorGetProductos)
routerApi.get('/productos/:id', controladorGetProductosSegunId)
routerApi.post('/productos', controladorPostProductos)
routerApi.put('/productos/:id', controladorPutProductosSegunId)
routerApi.delete('/productos/:id', controladorDeleteProductosSegunId)

exports.routerApi = routerApi;