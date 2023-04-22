import express from 'express';
import session from 'express-session'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import routerApiProducts from '../routers/apiProducts.js';
import routerApiCart from '../routers/apiShoppingCart.js';
import routerApiOrders from '../routers/apiOrders.js';
import routerApiUsers from '../routers/apiUsers.js'
import routerApiImages from '../routers/apiImages.js'
import routerLogin from '../routers/routerLogin.js'
import MongoStore from 'connect-mongo'
import { MongoClient } from 'mongodb'
import { SESSION_SECRET, CNX_STR_MONGO } from '../config/config.js';
import { passDecryptor } from '../controllers/jwt.js';
import { read } from '../daos/daoMongoDb.js';
import { Server as HttpServer } from 'http'


const app = express();
export const httpServer = new HttpServer(app)

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/public', express.static('public'))
app.use(express.static('public'));

//passport

app.use(session({
    store: MongoStore.create({
        mongoUrl: CNX_STR_MONGO,
    }),
    /* ----------------------------------------------------- */
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 600000
    }
}))

app.use(passport.initialize())

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    MongoClient.connect(CNX_STR_MONGO, { useNewUrlParser: true }, (err, client) => {
        const db = client.db("coderhouse");
        const collection = db.collection("users");
        if (err) console.log("Error occurred connecting to MongoDB...");
        return collection.findOne({"email": email}, {"_id":1, "email":1, "password":1, "name":1, "lastname":1, "image":1, "rol":1})
        .then(result => {
            const user = result
            done(null, user)
        })
    });
});

app.use(passport.session())

passport.use('login', new LocalStrategy(
    {usernameField:"email", passwordField:"password"},
    async (username, password, done) => {
            await read('users')
            .then(result => {
                const user = result.find(r => r.email === username)
                if (user) {
                    const passOriginal = passDecryptor(user.password)
                    if (passOriginal !== password) {
                        done(null, false)
                    }
                    done(null, user)
                } else {
                    done(null, false)
                }
            })
        }
    )
)

//rutas

app.use('/api', routerApiProducts)
app.use('/api', routerApiCart)
app.use('/api', routerApiUsers)
app.use('/api', routerApiOrders)
app.use('/api', routerApiImages)
app.use('/', routerLogin)
app.all('*',(req,res) => {
    res.status(404).json('no implementado')
})
