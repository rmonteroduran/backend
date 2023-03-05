import pino from 'pino'
import { NODE_ENV } from './config.js'

function buildProdLogger() {
    const prodLogger = pino('debug.log')
    prodLogger.level = 'debug'
    return prodLogger
}

function buildDevLogger() {
    const devLogger = pino()
    devLogger.level = 'info'
    return devLogger
}

let logger = null

if (NODE_ENV === 'production') {
    logger = buildProdLogger()
} else {
    logger = buildDevLogger()
}

export default logger