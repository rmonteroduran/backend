import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import dotenv from 'dotenv'
dotenv.config({path:'./src/config/.env'})
/* ------------------------------------------------*/
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'

import path from 'path'
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __dir = path.join(__dirname, '..')

const app = express();  
export const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

import handlebars from 'express-handlebars' 
import { read, add } from '../src/containers/contenedorDeMensajes.js'
import { contenedorDeProductosTest } from '../src/containers/contenedorDeProductosTest.js'
import { routerProductos } from '../src/routers/routerProductos.js'
import { routerAPI } from '../src/routers/routerAPI.js'
import { urlMongoAtlas, SESSION_SECRET } from '../src/config/config.js'
import {  generarPassOriginal } from '../src/services/jwt.js'
import { MongoClient } from 'mongodb'
import { cpus } from 'os'
import compression from 'compression'
import logger from '../src/services/logger.js'
import { getProducts, postProduct } from '../src/controllers/productsController.js'
import { getUser, postUser } from '../src/controllers/usersController.js'

var usuarioLogout = null

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://coderhouse:coderhouse@cluster0.kqfb586.mongodb.net/test`,
    }),
    /* ----------------------------------------------------- */
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 15000
    }
}))

//passport
app.use(passport.initialize())

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((uid, done) => {
    MongoClient.connect(urlMongoAtlas, { useNewUrlParser: true }, (err, client) => {
        const db = client.db("test");
        const collection = db.collection("users");
        if (err) console.log("Error occurred connecting to MongoDB...");
        return collection.findOne({"id": uid}, {"_id":1, "username":1, "password":1, "id":1})
        .then(result => {
            const user = Object.values(result)
            done(null, user)
        })
    });
});

app.use(passport.session())

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
app.use('/api', routerAPI)

app.get("/",(req, res) => {
    res.render("carga", {mensaje: 'Nuevo producto', sesion: req.session.user});
});

app.get("/productos-test",async (req, res) => {
    res.render("test", {mensaje: 'Productos test', resultado: contenedorDeProductosTest});
});

app.get("/info",async (req, res) => {
    var args = ''
    process.argv.slice(2).forEach((arg, index) => {
        args = index + ' -> ' + arg
    });
    res.render("info", {mensaje: 'Información de proceso', arg: args, platform: process.platform,
    version: process.version, memoria: process.memoryUsage().rss, path: process.argv[1], pid: process.pid, cwd: process.cwd(), cpus: cpus().length});
});

app.get("/infozip", compression(), async (req, res) => {
    var args = ''
    process.argv.slice(2).forEach((arg, index) => {
        args = index + ' -> ' + arg
    });
    res.render("info", {mensaje: 'Información de proceso', arg: args, platform: process.platform,
    version: process.version, memoria: process.memoryUsage().rss, path: process.argv[1], pid: process.pid, cwd: process.cwd(), cpus: cpus().length});
});

app.get("/registro",async (req, res) => {
    res.render("registro", {mensaje: 'Registrarse'});
});

app.get("/nuevo-usuario",async (req, res) => {
    const { username, password } = req.query
    if (!username || !password) {
        logger.error(`Error de registro de usuario: falla de registro`)
        return res.status(401).send('register failed')
    } else {
        await postUser(req.query)
        .then(result => {
            if (result === `usuario ya registrado`) {
                res.render("registro", {mensaje: 'Registrarse', error: 'usuario ya registrado'});
            } else {
                logger.info(`Registro exitoso de usuario: ${username}`)
                res.render("carga", {mensaje: 'Nuevo producto'});
            }
        })
        .catch(err => {
            res.render("registro", {mensaje: 'Registrarse', error: 'error de registro'});
        })
    }
})

passport.use('local-login', new LocalStrategy(
    {},
    async (username, password, done) => {
            await getUser(username)
            .then(user => {
                if (user) {
                    const passOriginal = generarPassOriginal(user.password)
                    if (passOriginal !== password) {
                        done(null, false)
                    }
                    done(null, user)
                } else {
                    done(null, false)
                }
            })
        })
    )

app.get('/login',
    passport.authenticate('local-login', { failWithError: true }),
    (req, res) => {
        const { username } = req.query
        if (!username) {
            logger.error(`Login error: falta username`)
            return res.status(401).send('login failed')
        } else {
            req.session.user = username
            logger.info(`Login exitoso de usuario: ${username} `)
            res.render("carga", {mensaje: 'Nuevo producto', sesion: req.session.user});
        }
    },
    function(err, req, res, next) {
        logger.error(`Login error: credenciales no válidas`)
        res.render("carga", {mensaje: 'Nuevo producto', sesion: '', autorizacion: 'credenciales no válidas'});
    },
    function(err, req, res, next) {
        logger.error(`Login error: credenciales no válidas`)
        res.render("carga", {mensaje: 'Nuevo producto', sesion: '', autorizacion: 'credenciales no válidas'});
    }
)

app.get('/logout', async (req, res) => {
    const username = req.session.user
    req.session.destroy(err => {
        if (err) {
            logger.error(`Logout error`)
            res.send({ status: 'Logout failed', body: err })
        } 
    })
    usuarioLogout = username
    logger.info(`Logout exitoso de usuario: ${username} `)
    res.render("carga", {mensaje: 'Nuevo producto'});
})

app.all('*', (req, res) => {
    const { url, method } = req
    logger.warn(`Ruta ${method} ${url} no implementada`)
    res.send(`Ruta ${method} ${url} no está implementada`)
})

//socket
io.on('connection', async (socket) => {

    if (usuarioLogout) {
        io.sockets.emit('mensajeLogout', usuarioLogout)
        usuarioLogout = null
    }
    
    //productos

    await getProducts()
    .then(result => {
        io.sockets.emit('productosActualizados', result)
    })

    socket.on('nuevoProducto', async producto => {
        await postProduct(producto)
        .then(async result => {
            const prods = await getProducts()
            io.sockets.emit('productosActualizados', prods)
        })
    })

    //mensajes

    io.sockets.emit('mensajesActualizados', await read())

    socket.on('nuevoMensaje', async mensaje => {
        mensaje.fecha = new Date()
        await add(mensaje)
        io.sockets.emit('mensajesActualizados', await read())
    })
})

