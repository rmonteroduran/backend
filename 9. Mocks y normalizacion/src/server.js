import express from 'express'
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'

import path from 'path'
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __dir = path.join(__dirname, '..')

const app = express();  
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

import handlebars from 'express-handlebars' 
import { randomUUID as generarId } from 'crypto'
import { contenedorDeProductos } from './contenedorDeProductos.js'
import { read, add } from './contenedorDeMensajes.js'
import { contenedorDeProductosTest } from './contenedorDeProductosTest.js'
import { routerProductos } from './routerProductos.js'
import { port } from './config.js'

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//handlebars
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dir + "/views/layouts",
        partialsDir: __dir + '/views/partials/'
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("public"));

app.use('/productos', routerProductos)

app.get("/",(req, res) => {
    res.render("carga", {mensaje: 'Nuevo producto'});
});

app.get("/productos-test",async (req, res) => {
    res.render("test", {mensaje: 'Productos test', resultado: contenedorDeProductosTest});
});

//socket
io.on('connection', async (socket) => {    
    
    //productos

    io.sockets.emit('productosActualizados', await contenedorDeProductos.recuperar())

    socket.on('nuevoProducto', async producto => {
        const nuevoProducto = producto
        nuevoProducto.id = generarId()
        await contenedorDeProductos.guardar(nuevoProducto)
        io.sockets.emit('productosActualizados', await contenedorDeProductos.recuperar())
    })

    //mensajes

    io.sockets.emit('mensajesActualizados', await read())

    socket.on('nuevoMensaje', async mensaje => {
        mensaje.fecha = new Date()
        await add(mensaje)
        io.sockets.emit('mensajesActualizados', await read())
    })
})

const server = httpServer.listen(port, () => {
    console.log(`servidor conectado en puerto ${server.address().port}`)
})