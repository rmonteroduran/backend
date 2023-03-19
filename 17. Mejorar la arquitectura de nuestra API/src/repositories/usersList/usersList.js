import logger from "../../services/logger.js"

export class UserList {
    #dao

    constructor(dao) {
        this.#dao = dao
    }

    async buscarPorUsername(username) {
        const dto = await this.#dao.buscarPorUsername(username)
        if (!dto) logger.error(`User list Buscar por username error - username no encontrado: ${username}`)
        return dto
    }

    async guardar(user) {
        const prod = await this.#dao.guardar(user)
        return prod
    }
}