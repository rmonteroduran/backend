import { PORT, MODO } from './config/config.js'
import { httpServer } from '../server/server.js'
import cluster from 'cluster'
import { cpus } from 'os'
import logger from './services/logger.js'

if (MODO === 'cluster') {

    const cantCpus = cpus().length

    if (cluster.isPrimary) {
        console.log('modo de ejecucion: CLUSTER')
        console.log(`proceso primario: pid ${process.pid}`)
        logger.info(`Servidor express modo cluster conectado!`)
    
        for (let i = 0; i < cantCpus; i++) {
            cluster.fork()
        }
    
        cluster.on('exit', (worker) => {
            cluster.fork()
        })
    } else {
        console.log(`proceso secundario: pid ${process.pid}`)
        httpServer.listen(PORT)
        logger.info(`Servidor express escuchando en el puerto ${PORT}`)
    }

} else {
    httpServer.listen(PORT, () => {
        console.log('modo de ejecucion: FORK')
        console.log(`proceso primario: pid ${process.pid}`)
        logger.info(`Servidor express modo fork escuchando en el puerto ${PORT}`)
    })
}
