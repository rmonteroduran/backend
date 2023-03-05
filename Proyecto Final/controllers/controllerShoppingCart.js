import { randomUUID } from 'crypto';
import { read, updateCartProducts, add, del} from '../containers/containerMongoDb.js'
import logger from '../config/logger.js'
import { admin_email } from '../config/config.js';
import { emailSender } from '../messaging/emailSender.js';

async function controllerPostCart(req, res) {
    await read("carts")
    .then(async result => {
        const newCart = {id: randomUUID(), email: req.user.email, products: []};
        result.push(newCart);
        await add('carts',newCart)
        logger.info(`Post cart exitoso: ${newCart.id} `)
        res.status(201);
        res.json(newCart);
    })
    .catch(err => {
        logger.error(`Post cart error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

async function controllerDeleteCart(req, res) {
    const { id_cart } = req.params
    await read("carts")
    .then(async result => {
        const idSearch = result.findIndex(c => c.id === id_cart)
        const search = result.find(r => r.id === id_cart)
        if (idSearch === -1) {
            logger.error(`Delete cart error: No se encontró el carrito con el id: ${id_cart}`)
            res.status(404);
            res.json({message: `No se encontró el carrito con el id: ${id_cart}`});
        } else {
            if (search.email !== req.user.email) {
                logger.error(`Delete cart error: El email del carrito no coincide con el email del usuario de la peticion: ${req.user.email}`)
                res.status(404);
                res.json({message: `El email del carrito no coincide con el email del usuario de la peticion: ${req.user.email}`});
            } else {
                result[idSearch] = {id: result[idSearch].id, products: []}
                await del('carts',id_cart)
                logger.info(`Delete cart exitoso: ${id_cart} `)
                res.status(200);
                res.json(search);
            }
        }
    })
    .catch(err => {
        logger.error(`Delete cart error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

async function controllerPostCartProduct(req, res) {
    const {productId} = req.body
    const {id_cart} = req.params
    await read("carts")
    .then(async result => {
        const cartIndex = result.findIndex(c => c.id === id_cart)
        const search = result.find(r => r.id === id_cart)
        if (cartIndex === -1) {
            logger.error(`Post cart product error: No se encontró el carrito con el id: ${id_cart}`)
            res.status(404);
            res.json({message: `No se encontró el carrito con el id: ${id_cart}`});
        } else {
            if (search.email !== req.user.email) {
                logger.error(`Post cart product error: El email del carrito no coincide con el email del usuario de la peticion: ${req.user.email}`)
                res.status(404);
                res.json({message: `El email del carrito no coincide con el email del usuario de la peticion: ${req.user.email}`});
            } else {
                await read("products")
                .then(async resul => {
                    const newCartProduct = resul.find(c => c.id === productId)
                    if (!newCartProduct) {
                        logger.error(`Post cart product error: No se encontró el producto con el id: ${productId}`)
                        res.status(404);
                        res.json({message: `No se encontró el producto con el id: ${productId}`});
                    } else {
                        const newCart = [...result[cartIndex].products, newCartProduct]
                        result[cartIndex].products = newCart
                        await updateCartProducts('carts', result[cartIndex].products, req.user.email, id_cart)
                        logger.info(`Post cart product exitoso: ${productId} `)
                        res.status(201);
                        res.json(result[cartIndex]);
                    }
                })
                .catch(err => {
                    logger.error(`Post cart product error: ${err}`)
                    res.status(500);
                    res.json({message: err})
                })
            }
        } 
    })
    .catch(err => {
        logger.error(`Post cart product error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

async function controllerGetCartProducts(req, res) {
    const {id_cart} = req.params
    await read("carts")
    .then(result => {
        const search = result.find(c => c.id === id_cart);
        if (!search) {
            logger.error(`Get cart products error: No se encontró el carrito con el id: ${id_cart}`)
            res.status(404);
            res.json({message: `No se encontró el carrito con el id: ${id_cart}`});
        } else {
            if (search.email === req.user.email) {
                res.status(200);
                res.json(search.products);
            } else {
                logger.error(`Get cart products error: El email del carrito no coincide con el email del usuario de la peticion: ${req.user.email}`)
                res.status(404);
                res.json({message: `El email del carrito no coincide con el email del usuario de la peticion: ${req.user.email}`});
            }
        }
    })
    .catch(err => {
        logger.error(`Get cart products error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

async function controllerDeleteCartProduct(req, res) {
    const {id_cart, id_prod} = req.params
    await read("carts")
    .then(async result => {
        const idSearch = result.findIndex(c => c.id === id_cart)
        const search = result.find(r => r.id === id_cart)
        if (idSearch === -1) {
            logger.error(`Delete cart product error: No se encontró el carrito con el id: ${id_cart}`)
            res.status(404);
            res.json({message: `No se encontró el carrito con el id: ${id_cart}`});
        } else {
            if (search.email !== req.user.email) {
                logger.error(`Delete cart product error: El email del carrito no coincide con el email del usuario de la peticion: ${req.user.email}`)
                res.status(404);
                res.json({message: `El email del carrito no coincide con el email del usuario de la peticion: ${req.user.email}`});
            } else {
                const products = result[idSearch].products
                const newProducts = products.filter(o => o.id !== id_prod)
                result[idSearch].products = newProducts
                await updateCartProducts('carts', result[idSearch].products, req.user.email, id_cart)
                logger.info(`Delete cart product exitoso: ${id_cart}`)
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

async function controllerSendCart(req, res) {
    const {id_cart} = req.params
    await read("carts")
    .then(async result => {
        const idSearch = result.findIndex(c => c.id === id_cart)
        const search = result.find(r => r.id === id_cart)
        if (idSearch === -1) {
            logger.error(`Send cart error: No se encontró el carrito con el id: ${id_cart}`)
            res.status(404);
            res.json({message: `No se encontró el carrito con el id: ${id_cart}`});
        } else {
            if (search.email !== req.user.email) {
                logger.error(`Send cart error: El email del carrito no coincide con el email del usuario de la peticion: ${req.user.email}`)
                res.status(404);
                res.json({message: `El email del carrito no coincide con el email del usuario de la peticion: ${req.user.email}`});
            } else {
                const products = JSON.stringify(search.products)
                await emailSender.send({
                    from: 'Coderhouse Backend 32185 Productos',
                    to: req.user.email,
                    subject: `Orden de compra creada ${id_cart}`,
                    html: `<h1>Orden de compra: ${id_cart}</h1><p>Productos: ${products}</p>`
                })
                await emailSender.send({
                    from: 'Coderhouse Backend 32185 Productos',
                    to: admin_email,
                    subject: `Orden de compra creada ${id_cart}`,
                    html: `<h1>Orden de compra: ${id_cart}</h1><p>Productos: ${products}</p>`
                })
                result[idSearch] = {id: result[idSearch].id, products: []}
                await del('carts',id_cart)
                logger.info(`Send cart exitoso: ${id_cart} `)
                res.status(200);
                res.json(result[idSearch]);
            }
        }
    })
    .catch(err => {
        logger.error(`Send cart error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

export {controllerPostCart,
    controllerDeleteCart,
    controllerPostCartProduct,
    controllerGetCartProducts,
    controllerDeleteCartProduct,
    controllerSendCart}