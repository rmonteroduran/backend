import { MODO_PERSISTENCIA } from '../../config/config.js'
import { UserList } from './usersList.js'

let UsersList

switch (MODO_PERSISTENCIA) {
    default:
        const { mongoClient } = await import('../../databases/MongoClient.js')
        const { DaoMongoDb } = await import('../../daos/daoMongoDb.js')
        const UsersCollection = mongoClient.db().collection('users')
        const daoMongoDb = new DaoMongoDb(UsersCollection)
        UsersList = new UserList(daoMongoDb)
}

export { UsersList } 