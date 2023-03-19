import { MongoClient } from 'mongodb';
import { urlMongoAtlas } from '../config/config.js';

const mongoClient = new MongoClient(urlMongoAtlas)

await mongoClient.connect()

export { mongoClient }