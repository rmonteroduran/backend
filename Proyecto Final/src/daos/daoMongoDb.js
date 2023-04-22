import { mongoDatabase } from '../containers/mongoClient.js';
import logger from '../services/logger.js'

async function read(name) {
    try {
        const dto = await mongoDatabase.collection(name).find().toArray()
        return dto
    } catch (err) {
        logger.error(`Read DB error: ${err}`)
        return(err)
    }
}

async function readById(name, _id) {
    try {
        const dto = await mongoDatabase.collection(name).findOne({_id})
        return dto
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
        await mongoDatabase.collection(name).replaceOne({_id: id}, {_id: id, name: data.name, description: data.description, image: data.image, price: data.price})
    } catch (err) {
        logger.error(`Update DB product error: ${err}`)
        return(err)
    }
}

async function updateCartProducts(name, data, email) {
    try {
        await mongoDatabase.collection(name).replaceOne({email: email}, {email: email, products: data})
    } catch (err) {
        logger.error(`Update DB cart products error: ${err}`)
        return(err)
    }
}

async function del(name, id) {
    try {
        await mongoDatabase.collection(name).deleteOne({_id: id}) 
    } catch (err) {
        logger.error(`Delete DB error: ${err}`)
        return(err)
    }
}

export { read, readById, add, updateProduct, updateCartProducts, del }