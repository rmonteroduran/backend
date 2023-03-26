import { mongoClient } from '../../databases/MongoClient.js';
import { usersDaoMongoDb } from './usersDao.js';

export const usersDao = new usersDaoMongoDb(mongoClient)