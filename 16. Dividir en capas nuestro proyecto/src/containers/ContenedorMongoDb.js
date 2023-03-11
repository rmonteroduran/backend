import { MongoClient } from 'mongodb'
import { urlMongoAtlas } from '../src/config.js'

export class ContenedorMongoDb {
    
    async guardar(cosa) {
        MongoClient.connect(urlMongoAtlas, { useNewUrlParser: true }, (err, client) => {
            const db = client.db("test");
            const collection = db.collection("products");
            if (err) console.log("Error occurred connecting to MongoDB...");
            collection.insertOne(cosa);
        });
    }

    async recuperar() {
        MongoClient.connect(urlMongoAtlas, { useNewUrlParser: true }, async (err, client) => {
            const db = client.db("test");
            const collection = db.collection("products");
            if (err) {
                console.log("Error occurred connecting to MongoDB...");
            } else {
                return(await collection.find().toArray())
            }
        });
    }

}
