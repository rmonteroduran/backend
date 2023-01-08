import { mysqlConfig } from './config.js';
import createKnexClient from 'knex';

export const clienteSql = createKnexClient(mysqlConfig);


