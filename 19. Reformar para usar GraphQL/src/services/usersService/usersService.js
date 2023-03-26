

export class UserService {
    #usuariosDao

    constructor( usuariosDao ) {
        this.#usuariosDao = usuariosDao
    }

    async guardar(user) {
        await this.#usuariosDao.guardar(user.datos())
        return user.datos()
    }

    async buscar(username) {
        const users = await this.#usuariosDao.buscarPorUsername(username)
        if (users) {
            return users
        }
    }
}
