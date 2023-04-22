import { add } from '../../daos/daoMongoDb.js'

export class UserService {
    #usuariosDao

    constructor( usuariosDao ) {
        this.#usuariosDao = usuariosDao
    }

    async guardar(user) {
        await this.#usuariosDao.guardar(user)
        const cartUser = {email: user.email, products: []}
        await add('carts', cartUser)
        return user
    }

    async buscar(email) {
        const users = await this.#usuariosDao.buscar(email)
        return users
    }
}
