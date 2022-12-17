import { mongoDatabase } from './mongoClient.js';

async function read(name) {
    try {
        return await mongoDatabase.collection(name).find({}).toArray()
    } catch (err) {
        return(err)
    }
}

async function add(name, data) {
    try {
        mongoCollection = mongoDatabase.collection(name);
        await mongoCollection.insertOne(data)
    } catch (err) {
        return(err)
    }
}

async function update(name, data, id) {
    try {
        mongoCollection = mongoDatabase.collection(name);
        await mongoCollection.replaceOne({id}, {data}) 
    } catch (err) {
        return(err)
    }
}

async function del(name, id) {
    try {
        mongoCollection = mongoDatabase.collection(name);
        await mongoCollection.deleteOne({id}) 
    } catch (err) {
        return(err)
    }
}

export { read, add, update, del }