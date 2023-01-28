import { Router } from 'express'
import { fork } from 'child_process'

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
            res.end('Fin de calculo: ' + msg + ' numeros generados. Ver detalle en console.log' )
        }
    })
})

