import { UsersService } from '../services/usersService.js'
import { randomUUID as generarId } from 'crypto'
import logger from '../services/logger.js'
import { generarPassEncriptada } from '../services/jwt.js'

export async function postUser(req, res, next) {
    try {
        const nuevoUsuario = req
        const result = await UsersService.buscar(nuevoUsuario.username)
        if (!result) {
            nuevoUsuario.password = generarPassEncriptada(nuevoUsuario.password);
            nuevoUsuario.id = generarId()
            await UsersService.guardar(nuevoUsuario)
            .then(result => {
                return result
            })
        } else {
            logger.error(`User post error - Usuario ya registrado`)
            return `usuario ya registrado`
        }
    } catch (error) {
        logger.error(error)
    }
}

export async function getUser(req, res, next) {
    try {
        const user = await UsersService.buscar(req)
        return user
    } catch (error) {
        logger.error(error)
    }
}