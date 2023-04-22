import logger from "../../services/logger.js"

export class productsDaoMongoDb {
    #productsDb
    
    constructor(mongoDatabase) {
        this.#productsDb = mongoDatabase.collection('products')
    }

    async guardar(dto) {
        await this.#productsDb.insertOne(dto)
    }

    async buscar() {
        const dto = await this.#productsDb.find().toArray()
        return dto
    }

    async buscarPorId(_id) {
        const dto = await this.#productsDb.findOne({_id})
        return dto
    }

    async actualizar(_id, dto) {
        try {
            const result = await this.#productsDb.replaceOne({ _id }, dto)
            return result
        }
        catch (err) {
            logger.error(`Actualizar error: ${err}`)
            return err
        }
    }

    async eliminar(_id) {
        try {
            const result = await this.#productsDb.deleteOne({ _id })
            return result
        }
        catch (err) {
            logger.error(`Eliminar error: ${err}`)
            return err
        }
    }
}