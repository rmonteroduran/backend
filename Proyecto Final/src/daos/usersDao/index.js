import { mongoDatabase } from '../../containers/mongoClient.js';
import { usersDaoMongoDb } from './usersDao.js';

export const usersDao = new usersDaoMongoDb(mongoDatabase)