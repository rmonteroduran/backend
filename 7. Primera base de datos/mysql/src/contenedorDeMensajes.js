import { ContenedorMysql } from './ContenedorMysql.js'
import { clienteSql } from './clienteSql.js'

export const contenedorDeMensajes = new ContenedorMysql(clienteSql, 'mensajes');