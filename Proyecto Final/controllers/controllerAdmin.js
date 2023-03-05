import { read} from '../containers/containerMongoDb.js'
import logger from '../config/logger.js'

async function adminCheck(req, res, next) {
    if (req.isAuthenticated()) {
        await read('users')
        .then(result => {
            const user = result.find(r => r.email === req.user.email)
            if (user.rol === "admin") {
                next()
            } else {
                logger.error(`Admin check: usuario no autorizado ${req.user.email}`)
                res.status(403)
                res.json('Usuario no autorizado')
            }
        })
        .catch(err => {
            logger.error(`Admin check error: ${err}`)
            res.status(500)
            res.json(err)
        })
    } else {
        logger.error(`Admin check: usuario no autenticado`)
        res.status(403)
        res.json('Usuario no autenticado')
    }
}

export { adminCheck }
