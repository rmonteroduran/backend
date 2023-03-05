import { passEncryptor } from '../controllers/jwt.js';
import { read, add } from '../containers/containerMongoDb.js'
import logger from '../config/logger.js'

async function controllerRegister(req, res) {
    const { email, password, name, lastname, image, rol} = req.body
    if (!email || !password || !name || !lastname || !image || !rol) {
        logger.error(`Register error: faltan datos de registro`)
        return res.status(401).send('register failed')
    } else {
        await read("users")
        .then(async result => {
            const search = result.find(r => r.email === email)
            if (search) {
                logger.error(`Register error: usuario ya registrado ${email}`)
                res.status(401);
                res.json({message: `Usuario ya registrado: ${email}`});
            } else {
                const user = req.body
                user.password = passEncryptor(password);
                await add('users', user)
                logger.info(`Registro exitoso de usuario: ${email} `)
                res.json({email: email, name: name, lastname: lastname, rol: rol});
            }
        })
        .catch(err => {
            logger.error(`Register error: ${err}`)
            res.status(500);
            res.json({mensaje: err})
        })
    }
}

async function controllerInfoUser(req, res) {
    await read("users")
        .then(result => {
            const search = result.find(r => r.email === req.user.email)
            if (!search) {
                logger.error(`User Info error: usuario no registrado ${req.user.email}`)
                res.status(401);
                res.json({message: `Usuario no registrado: ${req.user.email}`});
            } else {
                res.json(search)
            }
        })
        .catch(err => {
            logger.error(`User info error: ${err}`)
            res.status(500);
            res.json({mensaje: err})
        })
}

async function controllerLogin(req, res) {
    const { email } = req.body
    if (!email) {
        res.status(401)
        logger.error(`Login error: sin email de usuario`)
        res.json({message: `Login failed`})
    } else {
        logger.info(`Login exitoso de usuario: ${email} `)
        res.json(`Login exitoso: ${email}`)
    }
}

async function controllerLogout(req, res) {
    if(req.user){
        const email = req.user.email
        req.logout(function(err) {
            if (err) { return next(err); }
            logger.info(`Logout exitoso de usuario: ${email} `)
            res.json(`Logout exitoso: ${email}`)
        });
    } else {
        logger.error(`Logout error: usuario no autenticado`)
        res.json('Usuario no autenticado')
    }
}

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else {
        res.status(500)
        logger.error(`Authentication error: usuario no autenticado`)
        res.json('Usuario no autenticado')
    }
}


export { controllerRegister, controllerInfoUser, controllerLogin, controllerLogout, checkAuthentication }
