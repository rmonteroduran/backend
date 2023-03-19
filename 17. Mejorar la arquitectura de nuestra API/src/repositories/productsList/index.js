import { MODO_PERSISTENCIA } from '../../config/config.js'
import { ProductList } from './productsList.js'

let ProductsList

switch (MODO_PERSISTENCIA) {
    default:
        const { mongoClient } = await import('../../databases/MongoClient.js')
        const { DaoMongoDb } = await import('../../daos/daoMongoDb.js')
        const ProductsCollection = mongoClient.db().collection('products')
        const daoMongoDb = new DaoMongoDb(ProductsCollection)
        ProductsList = new ProductList(daoMongoDb)
}

export { ProductsList } 