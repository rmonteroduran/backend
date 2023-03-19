import logger from "../services/logger.js"

export class DaoMongoDb {
    #collection
    constructor(collection) {
        this.#collection = collection
    }

    async guardar(dto) {
        await this.#collection.insertOne(dto)
    }

    async buscar() {
        const dto = await this.#collection.find().toArray()
        if (!dto) logger.error(`Buscar error - set de datos no encontrado`)
        return dto
    }

    async buscarPorId(_id) {
        const dto = await this.#collection.findOne({ _id })
        if (!dto) logger.error(`Buscar por id error - Id no encontrado: ${_id}`)
        return dto
    }

    async buscarPorUsername(username) {
        const dto = await this.#collection.findOne({"username": username}, {"username":1, "password":1})
        if (!dto) logger.error(`Buscar por username error - username no encontrado: ${username}`)
        return dto
    }

    async actualizar(_id, dto) {
        const result = await this.#collection.replaceOne({ _id }, dto)
        if (result.matchedCount === 0) logger.error(`Actualizacion error - Id no encontrado: ${_id}`)
        if (result.modifiedCount === 0) throw new logger.error(`Actualizacion error: ${_id}`)
        return dto
    }
}