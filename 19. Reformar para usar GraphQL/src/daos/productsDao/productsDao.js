import logger from "../../services/logger.js"

export class productsDaoMongoDb {
    #productsDb
    
    constructor(mongoDbClient) {
        this.#productsDb = mongoDbClient.db('test').collection('products')
    }

    async guardar(dto) {
        await this.#productsDb.insertOne(dto)
    }

    async buscar(campo, valor) {
        let dto
        if (campo && valor) {
            dto = await this.#productsDb.filter(p => p[campo] == valor)           
        } else {
            dto = await this.#productsDb.find().toArray()
        }
        if (!dto) logger.error(`Buscar error - set de datos no encontrado`)
        return dto
    }

    async buscarPorId(_id) {
        const dto = await this.#productsDb.findOne({_id})
        if (!dto) logger.error(`Buscar por id error - Id no encontrado: ${_id}`)
        return dto
    }

    async buscarPorUsername(username) {
        const dto = await this.#productsDb.findOne({"username": username}, {"username":1, "password":1})
        if (!dto) logger.error(`Buscar por username error - username no encontrado: ${username}`)
        return dto
    }

    async actualizar(_id, dto) {
        try {
            await this.#productsDb.replaceOne({ _id }, dto)
            dto._id = _id
            return dto
        }
        catch (err) {
            logger.error(`Actualizar error: ${err}`)
            return err
        }
    }

    async eliminar(_id) {
        const dto = await this.#productsDb.findOne({_id})
        try {
            await this.#productsDb.deleteOne({ _id })
            return dto
        }
        catch (err) {
            logger.error(`Eliminar error: ${err}`)
            return err
        }
    }
}