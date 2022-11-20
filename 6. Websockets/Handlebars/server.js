const express = require('express');
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const fs = require('fs')
const { randomUUID } = require('crypto')
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
        const nuevoProducto = req.body;
        nuevoProducto.id = randomUUID();
        resultado.push(nuevoProducto);
        await fs.promises.writeFile(`./productos.txt`,JSON.stringify(resultado))
        res.status(201);
        res.render('carga', {mensaje: 'Nuevo producto'});
    })
    .catch(err => {
        res.status(500);
        res.json({mensaje: err})
    })
}

app.get('/productos', controladorGetProductos)
app.post('/productos', controladorPostProductos)

app.get("/",(req, res) => {
    res.render("carga", {mensaje: 'Nuevo producto'});
});

//socket


io.on('connection', async (socket) => {    
    
    const productos = await read("productos")

    //productos

    io.sockets.emit('productosActualizados', productos)

    socket.on('nuevoProducto', async producto => {
        await read("productos")
        .then(resultado => {
            io.sockets.emit('productosActualizados', resultado);
        })
    })

    //mensajes

    const mensajes = await read("mensajes")

    io.sockets.emit('mensajesActualizados', mensajes)

    socket.on('nuevoMensaje', async mensaje => {
        mensaje.fecha = new Date().toLocaleString()
        await read("mensajes")
        .then(async resultado => {
            const mensajes = resultado
            mensajes.push(mensaje)
            await fs.promises.writeFile(`./mensajes.txt`,JSON.stringify(mensajes))
            io.sockets.emit('mensajesActualizados', resultado);
        })
    })

})

const server = httpServer.listen(8080, () => {
    console.log(`servidor conectado en puerto ${server.address().port}`)
})