const express = require('express');
const fs = require('fs')
const { randomUUID } = require('crypto')
const app = express();

//middlewares
app.use(express.json()) //para interpretar cuando enviamos json
app.use(express.urlencoded({extended: true})) //para interpretar cuiando envio formulario
app.use(express.static("public")); //para acceder a carpeta


async function read(name) {
    try {
        const result = JSON.parse(await fs.promises.readFile(`./${name}.txt`,'utf-8'))
        return result
    } catch (error) {
        return(`Archivo ${name} no encontrado`)
    }
}

//controladores
async function controladorGetProductos(req, res) {
    await read("productos")
    .then(resultado => {
        res.render('pages/lista', {mensaje: 'Lista de productos', resultado});
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
        res.render('pages/carga', {mensaje: 'Ingrese el nuevo producto'});
    })
    .catch(err => {
        res.status(500);
        res.json({mensaje: err})
    })
}

app.get('/productos', controladorGetProductos)
app.post('/productos', controladorPostProductos)

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('pages/carga', {mensaje: 'Ingrese el nuevo producto'});
});


const server = app.listen(8080, () => {
    console.log(`conectado y escuchando en puerto ${server.address().port}`)
})