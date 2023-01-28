import { randomInt } from 'crypto'

process.on('message', msg => {
    const randomArray = []
    if (msg == '0') {
        for (let i = 0; i < 100000000; i++) {
            var number = randomInt(1, 1000)
            randomArray.push(number)
        }
    } else {
        for (let i = 0; i < parseInt(msg); i++) {
            var number = randomInt(1, 1000)
            randomArray.push(number)
        }
    }
    console.log(randomArray)
    process.send(randomArray.length)
    process.exit()
})

process.send('listo')