import { mongoClient } from '../../databases/MongoClient.js';
import { productsDaoMongoDb } from './productsDao.js';

export const productsDao = new productsDaoMongoDb(mongoClient)