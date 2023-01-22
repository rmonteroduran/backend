import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
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
import { port, urlMongoAtlas, SESSION_SECRET } from './config.js'
import { generarPassEncriptada, generarPassOriginal } from './jwt.js'
import { MongoClient } from 'mongodb';

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

app.get("/",(req, res) => {
    res.render("carga", {mensaje: 'Nuevo producto', sesion: req.session.user});
});

app.get("/productos-test",async (req, res) => {
    res.render("test", {mensaje: 'Productos test', resultado: contenedorDeProductosTest});
});

app.get("/registro",async (req, res) => {
    res.render("registro", {mensaje: 'Registrarse'});
});

app.get("/nuevo-usuario",async (req, res) => {
    const { username, password } = req.query
    if (!username || !password) {
        return res.status(401).send('register failed')
    } else {
        MongoClient.connect(urlMongoAtlas, { useNewUrlParser: true }, (err, client) => {
            const db = client.db("test");
            const collection = db.collection("users");
            if (err) console.log("Error occurred connecting to MongoDB...");
            return collection.findOne({"username": username}, {"username":1})
            .then(result => {
                if (result) {
                    res.render("registro", {mensaje: 'Registrarse', error: 'usuario ya registrado'});
                } else {
                    const user = req.query
                    user.password = generarPassEncriptada(password);
                    user.id = generarId()
                    collection.insertOne(user, (insertError, insertResponse) => {
                        if (insertError) reject(insertError);
                        res.render("carga", {mensaje: 'Nuevo producto', sesion: req.session.user});
                    });
                }
            })
        });
    }
});

passport.use('local-login', new LocalStrategy(
    {},
    (username, password, done) => {
        MongoClient.connect(urlMongoAtlas, { useNewUrlParser: true }, (err, client) => {
            const db = client.db("test");
            const collection = db.collection("users");
            if (err) console.log("Error occurred connecting to MongoDB...");
            return collection.findOne({"username": username}, {"username":1, "password":1})
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
        });
    })
)

app.get('/login',
    passport.authenticate('local-login', { failWithError: true }),
    (req, res) => {
        const { username } = req.query
        if (!username) {
            return res.status(401).send('login failed')
        } else {
            req.session.user = username
            res.render("carga", {mensaje: 'Nuevo producto', sesion: req.session.user});
        }
    },
    function(err, req, res, next) {
        res.render("carga", {mensaje: 'Nuevo producto', sesion: '', autorizacion: 'credenciales no válidas'});
    },
    function(err, req, res, next) {
        res.render("carga", {mensaje: 'Nuevo producto', sesion: '', autorizacion: 'credenciales no válidas'});
    }
)

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