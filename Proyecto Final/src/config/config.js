import dotenv from 'dotenv'
dotenv.config({path:'./src/config/.env'})

//mongoDb

export const CNX_STR_MONGO = process.env.URLMONGOATLAS
export const DB_NAME = 'coderhouse'
export const PERSISTENCIA = 'mongodb'

//session 

export const SESSION_SECRET = process.env.SESSION_SECRET
export const PRIVATE_KEY = process.env.PRIVATE_KEY

//

export const PORT = parseInt(process.argv[2]) || 8080
export const MODE = process.env.MODE ?? 'fork'
export const NODE_ENV = process.env.NODE_ENV

//

export const NODEMAILER_CONFIG = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.nodemailer_user,
        pass: process.env.nodemailer_pass
    }
}

export const admin_email = process.env.admin_email



