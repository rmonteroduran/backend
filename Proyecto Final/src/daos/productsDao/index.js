import { mongoDatabase } from '../../containers/mongoClient.js';
import { productsDaoMongoDb } from './productsDao.js';

export const productsDao = new productsDaoMongoDb(mongoDatabase)