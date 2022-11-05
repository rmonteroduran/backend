const express = require('express');
const fs = require('fs')
const { randomUUID } = require('crypto')
const app = express();
const handlebars = require('express-handlebars');

//middlewares
app.use(express.json()) //para interpretar cuando enviamos json
app.use(express.urlencoded({extended: true})) //para interpretar cuiando envio formulario

//handlebars
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + '/views/partials/'
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("public"));


async function read(name) {
    try {
        const result = JSON.parse(await fs.promises.readFile(`./${name}.txt`,'utf-8'))
        return result
    } catch (error) {
        return([])
    }
}

//controladores
async function controladorGetProductos(req, res) {
    await read("productos")
    .then(resultado => {
        res.render('lista', {mensaje: 'Lista de productos', resultado});
    })
    .catch(err => {
        res.status(500);
        res.json({mensaje: err})
    })
}

async function controladorPostProductos(req, res) {
    await read("productos")
    .then(async resultado => {
        console.log(req.body)
        const nuevoProducto = req.body;
        nuevoProducto.id = randomUUID();
        resultado.push(nuevoProducto);
        await fs.promises.writeFile(`./productos.txt`,JSON.stringify(resultado))
        res.status(201);
        res.render('carga', {mensaje: 'Ingrese el nuevo producto'});
    })
    .catch(err => {
        res.status(500);
        res.json({mensaje: err})
    })
}

app.get('/productos', controladorGetProductos)
app.post('/productos', controladorPostProductos)

app.get("/",(req, res) => {
    res.render("carga", {mensaje: 'Ingrese el nuevo producto'});
});

const server = app.listen(8080, () => {
    console.log(`conectado y escuchando en puerto ${server.address().port}`)
})