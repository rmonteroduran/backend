import axios from 'axios'
import { conectar, desconectar } from '../../src/app/server.js'

axios.defaults.baseURL = 'http://localhost:8080/'

describe('pruebas de integracion', () => {

    // antes de TODAS las pruebas
    before(async () => {
        await conectar()
    })

    // dsp de TODAS las pruebas
    after(async () => {
        await desconectar()
    })

    let id
    let title = 'mirinda'
    let titleUpdate = 'fanta'
    let price = '90'
    let priceUpdate = '110'
    let thumbnail = 'https://tofuu.getjusto.com/orioneat-prod/FNuqN4B9d63E5A7LN-fanta%20lata.png'

    describe('servidor', () => {

        it('creacion de producto', async () => {

            
            // ejecucion de la prueba
            const { data: resultado, status } = await axios.post(`/productos`,{
                title: title,
                price: price,
                thumbnail: thumbnail
            })

            id = resultado._id

            // validacion
            if (status !== 200) throw new Error('el estado debe ser 200')
            if (!resultado) throw new Error('no se encontró respuesta a la creación del producto')
            if (!resultado._id) throw new Error('no se generó id para el nuevo producto')
            if (resultado.title !== title) throw new Error('no coincide el nombre del producto creado')
            if (resultado.price !== price) throw new Error('no coincide el precio del producto creado')
            if (resultado.thumbnail !== thumbnail) throw new Error('no coincide la imagen del producto creado')
        })
        
        it('consulta de todos los productos', async () => {

            // ejecucion de la prueba
            const { data: resultado, status } = await axios.get(`/productos`)

            // validacion
            if (status !== 200) throw new Error('el estado debe ser 200')
            if (!resultado) throw new Error('no se encontraron productos')
            if (!resultado[0].title) throw new Error('los productos encontrados no tienen nombre')
            if (!resultado[0].price) throw new Error('los productos encontrados no tiene precio')
            if (!resultado[0].thumbnail) throw new Error('los productos encontrados no tiene imagen')
            if (!resultado[0]._id) throw new Error('los productos encontrados no tiene id')
        })

        it('consulta de producto por id', async () => {

            // ejecucion de la prueba
            const { data: resultado, status } = await axios.get(`/productos/${id}`)

            // validacion
            if (status !== 200) throw new Error('el estado debe ser 200')
            if (!resultado) throw new Error('no se encontró el producto')
            if (resultado.title !== title) throw new Error('no coincide el nombre del producto')
            if (resultado.price !== price) throw new Error('no coincide el precio del producto')
            if (resultado.thumbnail !== thumbnail) throw new Error('no coincide la imagen del producto')
        })

        it('actualizacion de producto', async () => {

            // ejecucion de la prueba
            const { data: resultado, status } = await axios.put(`/productos/${id}`,{
                "title": titleUpdate,
                "price": priceUpdate,
                "thumbnail": thumbnail
            })

            // validacion
            if (status !== 200) throw new Error('el estado debe ser 200')
            if (!resultado) throw new Error('no se devolvió información sobre la actualizacion')
            if (resultado.modifiedCount > 1) throw new Error('se modificaron más de un registro')
            if (resultado.modifiedCount < 1) throw new Error('no se modificaron registros')
        })

        it('eliminacion de producto', async () => {

            // ejecucion de la prueba
            const { data: resultado, status } = await axios.delete(`/productos/${id}`)

            // validacion
            if (status !== 200) throw new Error('el estado debe ser 200')
            if (!resultado) throw new Error('no se devolvió información sobre producto eliminado')
            if (resultado !== id) throw new Error('no coincide el id del producto eliminado')
        })

    })
})