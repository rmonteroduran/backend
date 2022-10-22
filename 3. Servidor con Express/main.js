const { conectar } = require('./server')

async function main() {
    try {
        const serv = await conectar(8080)
        console.log(`Conectado al puesto ${serv.address().port}`)
    } catch (error) {
        console.log('Algo falló: ' + error)
    }
}

main()