import { app } from '../server/server.js'
import { PORT } from '../src/config.js'

app.listen(PORT, () => {
    console.log(`Conectado puerto: ${PORT}`)
})

const result = await fetch('http://localhost:8080/').then(res => res.text())
console.log(result)

app.close()
console.log('desconectado!')