import { Router } from 'express'
import { randomUUID as generarId } from 'crypto'
import { MongoClient } from 'mongodb'
import { urlMongoAtlas } from '../src/config.js'

export const routerProductos = Router()

routerProductos.post('/', async (req, res) => {
    const nuevoProducto = req.body
    console.log(nuevoProducto)
    nuevoProducto.id = generarId()
    MongoClient.connect(urlMongoAtlas, { useNewUrlParser: true }, (err, client) => {
        const db = client.db("test");
        const collection = db.collection("products");
        if (err) console.log("Error occurred connecting to MongoDB...");
        collection.insertOne(nuevoProducto);
        logger.info(`Nuevo producto agregado`)
        res.json(nuevoProducto)
    });
})

routerProductos.get('/', async (req, res) => {
    MongoClient.connect(urlMongoAtlas, { useNewUrlParser: true }, async (err, client) => {
        const db = client.db("test");
        const collection = db.collection("products");
        if (err) {
            console.log("Error occurred connecting to MongoDB...");
        } else {
            res.json(await collection.find().toArray())
        }
        });
})