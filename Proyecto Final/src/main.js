import { PORT, MODE } from '../src/config/config.js'
import { httpServer } from './app/server.js'
import cluster from 'cluster'
import { cpus } from 'os'
import logger from '../src/services/logger.js'

if (MODE === 'cluster') {

    const cantCpus = cpus().length

    if (cluster.isPrimary) {
        logger.info(`Servidor express modo cluster escuchando en el puerto ${PORT}`)
        logger.info(`proceso primario: pid ${process.pid}`)

        for (let i = 0; i < cantCpus; i++) {
            cluster.fork()
        }
    
        cluster.on('exit', (worker) => {
            cluster.fork()
        })
    } else {
        httpServer.listen(PORT)
        logger.info(`proceso secundario: pid ${process.pid}`)
    }

} else {
    httpServer.listen(PORT, () => {
        logger.info(`Servidor express modo fork escuchando en el puerto ${PORT}`)
    })
}
