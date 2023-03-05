import { mongoDatabase } from './mongoClient.js';
import logger from '../config/logger.js'

async function read(name) {
    try {
        return await mongoDatabase.collection(name).find({}).toArray()
    } catch (err) {
        logger.error(`Read DB error: ${err}`)
        return(err)
    }
}

async function add(name, data) {
    try {
        await mongoDatabase.collection(name).insertOne(data)
    } catch (err) {
        logger.error(`Add DB error: ${err}`)
        return(err)
    }
}

async function updateProduct(name, data, id) {
    try {
        await mongoDatabase.collection(name).replaceOne({id: id}, {id: id, name: data.name, description: data.description, image: data.image, price: data.price})
    } catch (err) {
        logger.error(`Update DB product error: ${err}`)
        return(err)
    }
}

async function updateCartProducts(name, data, email, id) {
    try {
        await mongoDatabase.collection(name).replaceOne({id: id}, {id: id, email: email, products: data})
    } catch (err) {
        logger.error(`Update DB cart products error: ${err}`)
        return(err)
    }
}

async function del(name, id) {
    try {
        await mongoDatabase.collection(name).deleteOne({id: id}) 
    } catch (err) {
        logger.error(`Delete DB error: ${err}`)
        return(err)
    }
}

export { read, add, updateProduct, updateCartProducts, del }