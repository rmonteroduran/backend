import { randomUUID } from 'crypto';
import { read, update } from '../containers/containerFirestore.js'

async function controllerGetProducts(req, res) {
    await read("products")
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(500);
        res.json({mensaje: err})
    })
}

async function controllerGetProductsId({params: {id}}, res) {
    await read("products")
    .then(result => {
        const search = result.find(p => p.id === id);
        if (!search) {
            res.status(404);
            res.json({message: `No se encontró el producto con el id: ${id}`});
        } else {
            res.json(search);
        }
    })
    .catch(err => {
        res.status(500);
        res.json({message: err})
    })
}

async function controllerPostProducts({body}, res) {
    await read("products")
    .then(async result => {
        const newProduct = body;
        newProduct.id = randomUUID();
        result.push(newProduct);
        await update('products',result)
        res.status(201);
        res.json(newProduct);
    })
    .catch(err => {
        res.status(500);
        res.json({message: err})
    })
}

async function controllerPutProductsId({body, params: {id}}, res) {
    await read("products")
    .then(async result => {
        const idSearch = result.findIndex(c => c.id === id);
        if (idSearch === -1) {
            res.status(404);
            res.json({message: `No se encontró el producto con el id: ${id}`});
        } else {
            result[idSearch] = {...result[idSearch], ...body};
            await update('products',result)
            res.json(result[idSearch]);
        }
    })
    .catch(err => {
        res.status(500);
        res.json({message: err})
    })
}

async function controllerDeleteProductsId({params: {id}}, res) {
    await read("products")
    .then(async result => {
        const idSearch = result.findIndex(c => c.id === id)
        if (idSearch === -1) {
            res.status(404);
            res.json({message: `No se encontró el producto con el id: ${id}`});
        } else {
            const deletes = result.splice(idSearch, 1);
            await update('products',result)
            res.json(deletes[0]);
        }
    })
    .catch(err => {
        res.status(500);
        res.json({message: err})
    })
}

export { controllerGetProducts,
    controllerGetProductsId,
    controllerPostProducts,
    controllerPutProductsId,
    controllerDeleteProductsId }