import logger from "../../services/logger.js"

export class usersDaoMongoDb {
    #usersDb
    
    constructor(mongoDatabase) {
        this.#usersDb = mongoDatabase.collection('users')
    }

    async guardar(dto) {
        await this.#usersDb.insertOne(dto)
    }

    async buscar(email) {
        const dto = await this.#usersDb.findOne({"email": email})
        return dto
    }
}