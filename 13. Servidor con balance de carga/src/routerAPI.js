import { Router } from 'express'
import { fork } from 'child_process'
import { PORT } from './config.js'

export const routerAPI = Router()

routerAPI.get('/randoms', (req, res) => {
    const forked = fork('./src/random.js')
    forked.on('message', msg => {
        if (msg == 'listo') {
            if (!req.query.cant || req.query.cant == 0) {
                forked.send('0')
            } else {
                forked.send(req.query.cant)
            }
        } else {
            res.end(msg)
        }
    })
})

