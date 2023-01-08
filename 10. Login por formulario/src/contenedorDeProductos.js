import { ContenedorMysql } from './ContenedorMysql.js'
import { clienteSql } from './clienteSql.js'

export const contenedorDeProductos = new ContenedorMysql(clienteSql, 'productos');