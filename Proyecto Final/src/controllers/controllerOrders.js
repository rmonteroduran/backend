import { read, add, updateCartProducts } from '../daos/daoMongoDb.js'
import logger from '../services/logger.js'
import { admin_email } from '../config/config.js';
import { emailSender } from '../messaging/emailSender.js';

async function controllerNewOrder(req, res) {
    await read("carts")
    .then(async result => {
        const idSearch = result.findIndex(c => c.email === req.user.email)
        const search = result.find(r => r.email === req.user.email)
        if (idSearch === -1) {
            logger.error(`Send cart error: No se encontró el carrito`)
            res.status(404);
            res.json({message: `No se encontró el carrito`});
        } else {
            const products = JSON.stringify(search.products)
            const newOrder = {date: Date.now(), email: req.user.email, products: search.products}
            await add('orders',newOrder)
            await emailSender.send({
                from: 'Coderhouse Backend 32185 Productos',
                to: req.user.email,
                subject: `Orden de compra creada`,
                html: `<h1>Orden de compra</h1><p>Productos: ${products}</p>`
            })
            await emailSender.send({
                from: 'Coderhouse Backend 32185 Productos',
                to: admin_email,
                subject: `Orden de compra creada`,
                html: `<h1>Orden de compra</h1><p>Productos: ${products}</p>`
            })
            const newProducts = []
            await updateCartProducts('carts', newProducts, req.user.email)
            logger.info(`New order exitoso`)
            res.status(200);
            res.json(result[idSearch]);
        }
    })
    .catch(err => {
        logger.error(`New order error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

async function controllerGetOrders(req, res) {
    await read("orders")
    .then(async result => {
        const orders = result.filter(c => c.email === req.user.email)
        res.json(orders)
    })
    .catch(err => {
        logger.error(`Get orders error: ${err}`)
        res.status(500);
        res.json({mensaje: err})
    })
}


export { controllerGetOrders, controllerNewOrder }
