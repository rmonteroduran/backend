// dependencias de la prueba
import { Product } from '../../src/models/products.js'
import { ProductService } from '../../src/services/productsService/productsService.js'


// dao para pruebas ----------------------------------
class ProductsDao {
    constructor() { this.productos = [] }
    guardar(productoDto) { this.productos.push(productoDto) }
    buscarPorId(id) { return this.productos.find(u => u._id === id) }
    buscar() { return this.productos }
}
const productosDao = new ProductsDao()

//

describe('pruebas unitarias', () => {
    describe('servicio de productos', () => {
        it('creacion de un producto', async () => {

            // datos para pruebas -----------------------------------
            const nombreDelProducto = 'producto de prueba'
            const precioDelProducto = '123'
            const imagenDelProducto = 'https://www.adslzone.net/app/uploads-adslzone.net/2019/04/borrar-fondo-imagen.jpg'

            const datosNuevoProducto= new Product({
                title: nombreDelProducto,
                price: precioDelProducto,
                thumbnail: imagenDelProducto
            })

            // el componente a testear en mi prueba
            const servicioDeProductos = new ProductService( productosDao )

            // PRUEBA!
            const resultado = await servicioDeProductos.guardar(datosNuevoProducto.datos())

            // validacion
            if (!resultado) throw new Error('el producto creado es nulo')
            if (!resultado.title) throw new Error('el producto creado no tiene nombre')
            if (resultado.title !== nombreDelProducto) throw new Error('el producto creado no tiene el mismo nombre que el enviado')
            if (!resultado.price) throw new Error('el producto creado no tiene precio')
            if (resultado.price !== precioDelProducto) throw new Error('el producto creado no tiene el mismo precio que el enviado')
            if (!resultado.thumbnail) throw new Error('el producto creado no tiene imagen')
            if (resultado.thumbnail !== imagenDelProducto) throw new Error('el producto creado no tiene la misma imagen que la enviada')
            if (!resultado._id) throw new Error('el producto creado no tiene id')
            if (typeof resultado._id !== 'string') throw new Error('el producto creado tiene un id con tipo no string')

        })
        it('consulta de todos los productos', async () => {

            // el componente a testear en mi prueba
            const servicioDeProductos = new ProductService( productosDao )

            // PRUEBA!
            const resultado = await servicioDeProductos.buscar()

            // validacion
            if (!resultado) throw new Error('resultado nulo')
            if (resultado.length == 0) throw new Error('no hay productos en la base')
        })
        it('consulta de producto por id', async () => {

            // el componente a testear en mi prueba
            const servicioDeProductos = new ProductService( productosDao )

            // PRUEBA!
            const prod = productosDao.productos[0]._id
            const resultado = await servicioDeProductos.buscarPorId(prod)

            // validacion
            if (!resultado) throw new Error('resultado nulo')
            if (resultado._id !== prod) throw new Error('id no coincide')
        })
    })
})