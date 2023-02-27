import { Router } from 'express'
import { fork } from 'child_process'
export const routerAPI = Router()

routerAPI.get('/randoms', (req, res) => {
    logger.info(`Generación de números aleatorios - Inicio de proceso`)
    const forked = fork('./src/random.js')
    forked.on('message', msg => {
        if (msg == 'listo') {
            logger.info(`Generación de números aleatorios - Generación en curso`)
            if (!req.query.cant || req.query.cant == 0) {
                forked.send('0')
            } else {
                forked.send(req.query.cant)
            }
        } else {
            logger.info(`Generación de números aleatorios - Fin de proceso`)
            res.end(msg)
        }
    })
})

