import express from 'express';
import { controllerRegister, controllerInfoUser, controllerLogin, controllerLogout, checkAuthentication } from '../controllers/controllerUsers.js';
import { Strategy as LocalStrategy } from 'passport-local'
import { passDecryptor } from '../controllers/jwt.js';
import passport from 'passport'

const routerApiUsers = express.Router()

passport.use('login', new LocalStrategy(
    {},
    (username, password, done) => {
        MongoClient.connect(urlMongoAtlas, { useNewUrlParser: true }, (err, client) => {
            const db = client.db("coderhouse");
            const collection = db.collection("users");
            if (err) console.log("Error occurred connecting to MongoDB...");
            return collection.findOne({"username": username}, {"username":1, "password":1})
            .then(user => {
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
        });
    })
)


routerApiUsers.post("/users", controllerRegister);
routerApiUsers.get('/userinfo', checkAuthentication, controllerInfoUser)
routerApiUsers.post('/login', passport.authenticate('login', { failWithError: true }), controllerLogin)
routerApiUsers.post('/logout', controllerLogout)


export default routerApiUsers