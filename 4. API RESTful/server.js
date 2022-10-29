const express = require('express');
const { routerApi } = require('./routers/routerApi');

const app = express();

//middlewares
app.use(express.json()) //para interpretar cuando enviamos json
app.use(express.urlencoded({extended: true})) //para interpretar cuiando envio formulario
app.use('/views', express.static('views')) //para acceder a carpeta

//rutas
app.use('/api',routerApi)

const server = app.listen(8080, () => {
    console.log(`conectado y escuchando en puerto ${server.address().port}`)
})