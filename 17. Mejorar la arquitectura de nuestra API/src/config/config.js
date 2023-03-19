import dotenv from 'dotenv'
dotenv.config({path:'./src/config/.env'})

const mysqlClient = process.env.MYSQLCLIENT
const mysqlConnection = process.env.MYSQLCONNECTION
export const urlMongoAtlas = process.env.URLMONGOATLAS
export const PRIVATE_KEY = process.env.PRIVATE_KEY
export const SESSION_SECRET = process.env.SESSION_SECRET

export const mysqlConfig = {
    client: mysqlClient,
    connection: mysqlConnection //con clave
}

//export const PORT = parseInt(process.env.PORT ?? '8080') || 0
export const PORT = parseInt(process.argv[2]) || 8080
export const MODO = process.env.MODO ?? 'fork'
export const MODO_PERSISTENCIA = process.env.MODO_PERSISTENCIA ?? 'mongodb'