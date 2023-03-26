import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import dotenv from 'dotenv'
dotenv.config({path:'./src/config/.env'})
import { routerProductos } from '../routers/routerProductos.js'
/* ------------------------------------------------*/
const app = express();  

import { urlMongoAtlas, SESSION_SECRET, PORT, MODO } from '../config/config.js'
import { getUser, postUser } from '../controllers/usersController.js'
import { generarPassOriginal } from '../services/jwt.js'
import { MongoClient } from 'mongodb'
import { cpus } from 'os'
import compression from 'compression'
import logger from '../services/logger.js'
import cluster from 'cluster'
import { graphqlMiddleware } from '../graphql/graphqlMiddleware.js'

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

//routers

app.use('/productos', routerProductos)
app.use('/graphql', graphqlMiddleware)

app.get("/info", compression(), async (req, res) => {
    var args = ''
    process.argv.slice(2).forEach((arg, index) => {
        args = index + ' -> ' + arg
    });
    res.send(`Información de proceso: arg: ${args}, platform: ${process.platform},
    version: ${process.version}, memoria: ${process.memoryUsage().rss}, path: ${process.argv[1]}, pid: ${process.pid}, cwd: ${process.cwd()}, cpus: ${cpus().length}`)
});

app.get("/nuevo-usuario",async (req, res) => {
    const { username, password } = req.query
    if (!username || !password) {
        logger.error(`Error de registro de usuario: falla de registro`)
        return res.status(401).send(`Error de registro de usuario: falla de registro`)
    } else {
        await postUser(req.query)
        .then(result => {
            if (result === `usuario ya registrado`) {
                res.send(`usuario ya registrado`);
            } else {
                logger.info(`Registro exitoso de usuario: ${username}`)
                res.send(`Registro exitoso de usuario: ${username}`);
            }
        })
        .catch(err => {
            res.send(`Error de registro`);
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
            return res.status(401).send(`Login error: falta username`)
        } else {
            req.session.user = username
            logger.info(`Login exitoso de usuario: ${username} `)
            res.send(`Login exitoso de usuario: ${username} `);
        }
    },
    function(err, req, res, next) {
        logger.error(`Login error: credenciales no válidas`)
        res.send(`Login error: credenciales no válidas`);
    },
    function(err, req, res, next) {
        logger.error(`Login error: credenciales no válidas`)
        res.send(`Login error: credenciales no válidas`);
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
    res.send(`Logout exitoso de usuario: ${username} `);
})

app.all('*', (req, res) => {
    const { url, method } = req
    res.send(`Ruta ${method} ${url} no está implementada`)
})

//server

let server

export function conectar() {

    if (MODO === 'cluster') {
    
        const cantCpus = cpus().length
    
        if (cluster.isPrimary) {
            console.log('modo de ejecucion: CLUSTER')
            console.log(`proceso primario: pid ${process.pid}`)
            logger.info(`Servidor express modo cluster conectado!`)
        
            for (let i = 0; i < cantCpus; i++) {
                cluster.fork()
            }
        
            cluster.on('exit', (worker) => {
                cluster.fork()
            })
        } else {
            console.log(`proceso secundario: pid ${process.pid}`)
            server = app.listen(PORT)
            logger.info(`Servidor express escuchando en el puerto ${PORT}`)
        }
    
    } else {
        server = app.listen(PORT, () => {
            console.log('modo de ejecucion: FORK')
            console.log(`proceso primario: pid ${process.pid}`)
            logger.info(`Servidor express modo fork escuchando en el puerto ${PORT}`)
        })
    }

}

export function desconectar() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            // console.log(`desconectado!`)
            resolve(true)
        })
    })
}


