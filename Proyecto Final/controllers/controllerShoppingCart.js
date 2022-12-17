import { randomUUID } from 'crypto';
import { read, update } from '../containers/containerFirestore.js'

async function controllerPostCart(req, res) {
    await read("carts")
    .then(async result => {
        const newCart = {id: randomUUID(), products: []};
        result.push(newCart);
        await update('carts',result)
        res.status(201);
        res.json(newCart);
    })
    .catch(err => {
        res.status(500);
        res.json({message: err})
    })
}

async function controllerDeleteCart({params: {id_cart}}, res) {
    await read("carts")
    .then(async result => {
        const idSearch = result.findIndex(c => c.id === id_cart)
        if (idSearch === -1) {
            res.status(404);
            res.json({message: `No se encontró el carrito con el id: ${id_cart}`});
        } else {
            result[idSearch] = {id: result[idSearch].id, products: []}
            await update('carts',result)
            res.status(200);
            res.json(result[idSearch]);
        }
    })
    .catch(err => {
        res.status(500);
        res.json({message: err})
    })
}

async function controllerPostCartProduct({body, params: {id_cart}}, res) {
    await read("carts")
    .then(async result => {
        const cartIndex = result.findIndex(c => c.id === id_cart)
        if (cartIndex === -1) {
            res.status(404);
            res.json({message: `No se encontró el carrito con el id: ${id_cart}`});
        } else {
            await read("products")
            .then(async resul => {
                const newCartProduct = resul.find(c => c.id === body.id)
                if (!newCartProduct) {
                    res.status(404);
                    res.json({message: `No se encontró el producto con el id: ${body.id}`});
                } else {
                    const newCart = [...result[cartIndex].products, newCartProduct]
                    result[cartIndex].products = newCart
                    await update('carts',result)
                    res.status(201);
                    res.json(result[cartIndex]);
                }
            })
            .catch(err => {
                res.status(500);
                res.json({message: err})
            })
        }
    })
    .catch(err => {
        res.status(500);
        res.json({message: err})
    })
}

async function controllerGetCartProducts({params: {id_cart}}, res) {
    await read("carts")
    .then(result => {
        const search = result.find(c => c.id === id_cart);
        if (!search) {
            res.status(404);
            res.json({message: `No se encontró el carrito con el id: ${id_cart}`});
        } else {
            res.status(200);
            res.json(search);
        }
    })
    .catch(err => {
        res.status(500);
        res.json({message: err})
    })
}

async function controllerDeleteCartProduct({params: {id_cart, id_prod}}, res) {
    await read("carts")
    .then(async result => {
        const idSearch = result.findIndex(c => c.id === id_cart)
        if (idSearch === -1) {
            res.status(404);
            res.json({message: `No se encontró el carrito con el id: ${id_cart}`});
        } else {
            const products = result[idSearch].products
            const newProducts = products.filter(o => o.id !== id_prod)
            result[idSearch].products = newProducts
            await update('carts',result)
            res.status(200);
            res.json(result[idSearch]);
        }
    })
    .catch(err => {
        res.status(500);
        res.json({message: err})
    })
}


export {controllerPostCart,
    controllerDeleteCart,
    controllerPostCartProduct,
    controllerGetCartProducts,
    controllerDeleteCartProduct}