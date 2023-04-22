import {servicioDeUsuarios} from '../services/usersService/index.js'
import logger from '../services/logger.js'
import { User } from '../models/users.js'

export async function postUser(req, res, next) {
    try {
        const { email, password, name, lastname, image, rol} = req.body
        if (!email || !password || !name || !lastname || !image || !rol) {
            logger.error(`Register error: faltan datos de registro`)
            res.status(401)
            res.send('Register error: faltan datos de registro')
        } else {
            const result = await servicioDeUsuarios.buscar(email)
            if (!result) {
                const nuevoUsuario = new User(req.body)
                await servicioDeUsuarios.guardar(nuevoUsuario.datos())
                .then(result => {
                    res.json(result)
                })
            } else {
                logger.error(`User post error - Usuario ${email} ya registrado`)
                res.status(400);
                res.json({message: `Usuario ${email} ya registrado`})
            }
        }
    } catch (err) {
        logger.error(err)
        res.status(500);
        res.json({message: err})
    }
}

export async function getUser(req, res, next) {
    try {
        const user = await servicioDeUsuarios.buscar(req.user.email)
        if (user) {
            res.json(user)
        } else {
            logger.error(`User Info error: usuario no registrado ${req.user.email}`)
            res.status(401);
            res.json({message: `Usuario no registrado: ${req.user.email}`});
        }
    } catch (err) {
        logger.error(`User info error: ${err}`)
        res.status(500);
        res.json({mensaje: err})
    }
}

export async function controllerLogin(req, res) {
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

export async function controllerLogout(req, res) {
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

export async function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else {
        res.status(500)
        logger.error(`Authentication error: usuario no autenticado`)
        res.json('Usuario no autenticado')
    }
}