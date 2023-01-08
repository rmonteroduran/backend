import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
/* ------------------------------------------------*/
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

var usuarioLogout = null

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://coderhouse:coderhouse@cluster0.kqfb586.mongodb.net/test`,
    }),
    /* ----------------------------------------------------- */
    secret: 'tero',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 15000
    }
}))

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
    res.render("carga", {mensaje: 'Nuevo producto', sesion: req.session.user});
});

app.get("/productos-test",async (req, res) => {
    res.render("test", {mensaje: 'Productos test', resultado: contenedorDeProductosTest});
});

app.get('/login', (req, res) => {
    const { username } = req.query
    if (!username) {
        return res.status(401).send('login failed')
    } else {
        req.session.user = username
        res.render("carga", {mensaje: 'Nuevo producto', sesion: req.session.user});
    }
})

app.get('/logout', async (req, res) => {
    const username = req.session.user
    req.session.destroy(err => {
        if (err) res.send({ status: 'Logout failed', body: err })
    })
    usuarioLogout = username
    res.render("carga", {mensaje: 'Nuevo producto'});
})

//socket
io.on('connection', async (socket) => {

    if (usuarioLogout) {
        io.sockets.emit('mensajeLogout', usuarioLogout)
        usuarioLogout = null
    }
    
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