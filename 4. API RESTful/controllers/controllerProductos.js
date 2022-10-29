const fs = require('fs')
const { randomUUID } = require('crypto')

async function read(name) {
    try {
        const result = JSON.parse(await fs.promises.readFile(`./${name}.txt`,'utf-8'))
        return result
    } catch (error) {
        return(`Archivo ${name} no encontrado`)
    }
}

async function controladorGetProductos(req, res) {
    await read("productos")
    .then(resultado => {
        res.json(resultado)
    })
    .catch(err => {
        res.status(500);
        res.json({mensaje: err})
    })
}

async function controladorGetProductosSegunId({params: {id}}, res) {
    await read("productos")
    .then(resultado => {
        const buscado = resultado.find(p => p.id === id);
        if (!buscado) {
            res.status(404);
            res.json({mensaje: `No se encontró el producto con el id: ${id}`});
        } else {
            res.json(buscado);
        }
    })
    .catch(err => {
        res.status(500);
        res.json({mensaje: err})
    })
}

async function controladorPostProductos(req, res) {
    await read("productos")
    .then(async resultado => {
        const nuevoProducto = req.body;
        nuevoProducto.id = randomUUID();
        resultado.push(nuevoProducto);
        await fs.promises.writeFile(`./productos.txt`,JSON.stringify(resultado))
        res.status(201);
        res.json(nuevoProducto);
    })
    .catch(err => {
        res.status(500);
        res.json({mensaje: err})
    })
}

async function controladorPutProductosSegunId({body, params: {id}}, res) {
    await read("productos")
    .then(async resultado => {
        const indiceBuscado = resultado.findIndex(c => c.id === id);
        if (indiceBuscado === -1) {
            res.status(404);
            res.json({mensaje: `No se encontró el producto con el id: ${id}`});
        } else {
            resultado[indiceBuscado] = {...resultado[indiceBuscado], ...body};
            await fs.promises.writeFile(`./productos.txt`,JSON.stringify(resultado))
            res.json(resultado[indiceBuscado]);
        }
    })
    .catch(err => {
        res.status(500);
        res.json({mensaje: err})
    })
}

async function controladorDeleteProductosSegunId({params: {id}}, res) {
    await read("productos")
    .then(async resultado => {
        const indiceBuscado = resultado.findIndex(c => c.id === id)
        if (indiceBuscado === -1) {
            res.status(404);
            res.json({mensaje: `No se encontró el producto con el id: ${id}`});
        } else {
            const borrados = resultado.splice(indiceBuscado, 1);
            await fs.promises.writeFile(`./productos.txt`,JSON.stringify(resultado))
            res.json(borrados[0]);
        }
    })
    .catch(err => {
        res.status(500);
        res.json({mensaje: err})
    })
}

exports.controladorGetProductos = controladorGetProductos;
exports.controladorGetProductosSegunId = controladorGetProductosSegunId;
exports.controladorPostProductos = controladorPostProductos;
exports.controladorPutProductosSegunId = controladorPutProductosSegunId;
exports.controladorDeleteProductosSegunId = controladorDeleteProductosSegunId;