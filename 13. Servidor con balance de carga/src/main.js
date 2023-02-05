import { PORT, MODO } from './config.js'
import { httpServer } from '../server/server.js'
import cluster from 'cluster'
import { cpus } from 'os'

if (MODO === 'cluster') {

    const cantCpus = cpus().length

    if (cluster.isPrimary) {
        console.log('modo de ejecucion: CLUSTER')
        console.log(`proceso primario: pid ${process.pid}`)
    
        for (let i = 0; i < cantCpus; i++) {
            cluster.fork()
        }
    
        cluster.on('exit', (worker) => {
            cluster.fork()
        })
    } else {
        console.log(`proceso secundario: pid ${process.pid}`)
        httpServer.listen(PORT)
    }

} else {
    httpServer.listen(PORT, () => {
        console.log('modo de ejecucion: FORK')
        console.log(`proceso primario: pid ${process.pid}`)
    })
}
