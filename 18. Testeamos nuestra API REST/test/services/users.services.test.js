// dependencias de la prueba
import { User } from '../../src/models/users.js'
import { UserService } from '../../src/services/usersService/usersService.js'


// dao para pruebas ----------------------------------
class UsuariosDao {
    constructor() { this.usuarios = [] }
    guardar(usuarioDto) { this.usuarios.push(usuarioDto) }
    buscarPorId(id) { return this.usuarios.find(u => u.id === id) }
    buscarPorUsername(username) { return this.usuarios.filter(u => u.username === username) }
}
const usuariosDao = new UsuariosDao()

//

describe('pruebas unitarias', () => {
    describe('servicio de usuarios', () => {
        it('creacion de un usuario', async () => {

            // datos para pruebas -----------------------------------
            const nombreDelUsuario = 'nombre de prueba'
            const passwordDeUsuario = '1234'

            const datosNuevoUsuario = new User({
                username: nombreDelUsuario,
                password: passwordDeUsuario
            })

            // el componente a testear en mi prueba
            const servicioDeUsuarios = new UserService( usuariosDao )

            // PRUEBA!
            const resultado = await servicioDeUsuarios.guardar(datosNuevoUsuario)

            // validacion 
            if (!resultado) throw new Error('el usuario creado es nulo')
            if (!resultado.username) throw new Error('el usuario creado no tiene nombre')
            if (resultado.username !== nombreDelUsuario) throw new Error('el usuario creado no tiene el mismo nombre que el enviado')
            if (!resultado.password) throw new Error('el usuario creado no tiene password')
            if (resultado.password !== passwordDeUsuario) throw new Error('el usuario creado no tiene el mismo passwors que el enviado')
            if (!resultado.id) throw new Error('el usuario creado no tiene id')
            if (typeof resultado.id !== 'string') throw new Error('el usuario creado tiene un id con tipo no string')

        })
        it('consulta de un usuario', async () => {

            // datos para pruebas -----------------------------------
            const nombreDelUsuario = 'nombre de prueba'

            // el componente a testear en mi prueba
            const servicioDeUsuarios = new UserService( usuariosDao )

            // PRUEBA!
            const resultado = await servicioDeUsuarios.buscar(nombreDelUsuario)

            // validacion 
            if (!resultado) throw new Error('resultado nulo')

        })
    })
    
})