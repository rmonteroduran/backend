import { randomInt } from 'crypto'

process.on('message', msg => {
    const randomArray = []
    if (msg == '0') {
        for (let i = 0; i < 100000000; i++) {
            var number = randomInt(1, 500)
            randomArray.push(number)
        }
    } else {
        for (let i = 0; i < parseInt(msg); i++) {
            var number = randomInt(1, 500)
            randomArray.push(number)
        }
    }
    // forEach
    const resultado = {}
    randomArray.forEach(el => (resultado[el] = resultado[el] + 1 || 1))
    process.send(JSON.stringify(resultado))
    process.exit()
})

process.send('listo')