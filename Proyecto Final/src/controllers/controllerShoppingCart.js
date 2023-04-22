import { read, updateCartProducts} from '../daos/daoMongoDb.js'
import logger from '../services/logger.js'

async function controllerPostCartProduct(req, res) {
    const {productId} = req.body
    await read("carts")
    .then(async result => {
        const cartIndex = result.findIndex(r => r.email === req.user.email)
        const search = result.find(r => r.email === req.user.email)
        const products = search.products
        await read("products")
        .then(async resul => {
            const newCartProduct = resul.find(c => c._id === productId)
            if (!newCartProduct) {
                logger.error(`Post cart product error: No se encontró el producto con el id: ${productId}`)
                res.status(404);
                res.json({message: `No se encontró el producto con el id: ${productId}`});
            } else {
                const existProductIndex = products.findIndex(p => p._id === productId)
                if (existProductIndex === -1) {
                    newCartProduct.quantity = 1
                    const newCart = [...result[cartIndex].products, newCartProduct]
                    result[cartIndex].products = newCart
                    await updateCartProducts('carts', result[cartIndex].products, req.user.email)
                    logger.info(`Post cart product exitoso: ${productId} `)
                    res.status(201);
                    res.json(result[cartIndex]);
                } else {
                    result[cartIndex].products[existProductIndex].quantity ++
                    await updateCartProducts('carts', result[cartIndex].products, req.user.email)
                    logger.info(`Post cart product exitoso: ${productId} `)
                    res.status(201);
                    res.json(result[cartIndex]);
                }
            }
        })
        .catch(err => {
            logger.error(`Post cart product error: ${err}`)
            res.status(500);
            res.json({message: err})
        })
    })
    .catch(err => {
        logger.error(`Post cart product error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

async function controllerGetCartProducts(req, res) {
    await read("carts")
    .then(result => {
        const search = result.find(c => c.email === req.user.email);
        if (!search) {
            logger.error(`Get cart products error: No se encontró el carrito`)
            res.status(404);
            res.json({message: `No se encontró el carrito`});
        } else {
            res.status(200);
            res.json(search.products);
        }
    })
    .catch(err => {
        logger.error(`Get cart products error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

async function controllerDeleteCartProduct(req, res) {
    const {id_prod} = req.params
    await read("carts")
    .then(async result => {
        const idSearch = result.findIndex(c => c.email === req.user.email)
        if (idSearch === -1) {
            logger.error(`Delete cart product error: No se encontró el carrito`)
            res.status(404);
            res.json({message: `No se encontró el carrito`});
        } else {
            const products = result[idSearch].products
            const existProductIndex = products.findIndex(p => p._id === id_prod)
            if (existProductIndex === -1) {
                logger.info(`El carrito no posee el producto`)
                res.status(200);
                res.json(result[idSearch]);
            } else {
                if (result[idSearch].products[existProductIndex].quantity > 1) {
                    result[idSearch].products[existProductIndex].quantity --
                    await updateCartProducts('carts', result[idSearch].products, req.user.email)
                } else {
                    const newProducts = products.filter(o => o._id !== id_prod)
                    result[idSearch].products = newProducts
                    await updateCartProducts('carts', result[idSearch].products, req.user.email)
                }
                logger.info(`Delete cart product exitoso: ${id_prod}`)
                res.status(200);
                res.json(result[idSearch]);
            }
        }
    })
    .catch(err => {
        logger.error(`Delete cart product error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

export {
    controllerPostCartProduct,
    controllerGetCartProducts,
    controllerDeleteCartProduct,
    }