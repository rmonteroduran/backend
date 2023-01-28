import parseArgs from 'minimist'
import dotenv from 'dotenv'
dotenv.config({path:'./src/.env'})

const mysqlClient = process.env.MYSQLCLIENT
const mysqlConnection = process.env.MYSQLCONNECTION
export const urlMongoAtlas = process.env.URLMONGOATLAS
export const PRIVATE_KEY = process.env.PRIVATE_KEY
export const SESSION_SECRET = process.env.SESSION_SECRET

export const mysqlConfig = {
    client: mysqlClient,
    connection: mysqlConnection //con clave
}

export const port = parseArgs(process.argv.slice(2)).p || 8080