import { randomUUID } from 'crypto';
import { read, updateProduct, del, add } from '../containers/containerMongoDb.js'
import logger from '../config/logger.js';

async function controllerGetProducts(req, res) {
    await read("products")
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        logger.error(`Get products error: ${err}`)
        res.status(500);
        res.json({mensaje: err})
    })
}

async function controllerGetProductsId({params: {id}}, res) {
    await read("products")
    .then(result => {
        const search = result.find(p => p.id === id);
        if (!search) {
            logger.error(`Get product id error: No se encontró el producto con el id: ${id}`)
            res.status(404);
            res.json({message: `No se encontró el producto con el id: ${id}`});
        } else {
            res.json(search);
        }
    })
    .catch(err => {
        logger.error(`Get product id error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

async function controllerPostProducts({body}, res) {
    await read("products")
    .then(async result => {
        const newProduct = body;
        newProduct.id = randomUUID();
        await add('products',newProduct)
        logger.info(`Post product exitoso: ${newProduct}`)
        res.status(201);
        res.json(newProduct);
    })
    .catch(err => {
        logger.error(`Post product error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

async function controllerPutProductsId({body, params: {id}}, res) {
    await read("products")
    .then(async result => {
        const idSearch = result.findIndex(c => c.id === id);
        if (idSearch === -1) {
            logger.error(`Put product error: No se encontró el producto con el id: ${id}`)
            res.status(404);
            res.json({message: `No se encontró el producto con el id: ${id}`});
        } else {
            result[idSearch] = {...result[idSearch], ...body};
            await updateProduct('products', result[idSearch], result[idSearch].id)
            logger.info(`Put product exitoso: ${result[idSearch]}`)
            res.json(result[idSearch]);
        }
    })
    .catch(err => {
        logger.error(`Put product error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

async function controllerDeleteProductsId({params: {id}}, res) {
    await read("products")
    .then(async result => {
        const idSearch = result.findIndex(c => c.id === id)
        if (idSearch === -1) {
            logger.error(`Delete product error: No se encontró el producto con el id: ${id}`)
            res.status(404);
            res.json({message: `No se encontró el producto con el id: ${id}`});
        } else {
            const deletes = result.splice(idSearch, 1);
            await del('products',id)
            logger.error(`Delete product exitoso: ${deletes[0]}`)
            res.json(deletes[0]);
        }
    })
    .catch(err => {
        logger.error(`Delete product error: ${err}`)
        res.status(500);
        res.json({message: err})
    })
}

export { controllerGetProducts,
    controllerGetProductsId,
    controllerPostProducts,
    controllerPutProductsId,
    controllerDeleteProductsId }