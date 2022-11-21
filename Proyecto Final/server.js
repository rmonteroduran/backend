import express from 'express';
import routerApiProducts from './routers/apiProducts.js';
import routerApiCart from './routers/apiShoppingCart.js';
import routerApiAdmin from './routers/apiAdmin.js';
import multer from 'multer'

const upload = multer()
const app = express();

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/public', express.static('public'))
app.use(upload.array()); 
app.use(express.static('public'));

//rutas
app.use('/api', routerApiProducts)
app.use('/api', routerApiCart)
app.use('/api', routerApiAdmin)
app.all('*',(req,res) => {
    res.status(404).json('no implementado')
})

const port = process.env.PORT ?? 8080
const server = app.listen(port, () => {
    console.log(`conectado y escuchando en puerto ${server.address().port}`)
})