import { normalize, schema } from "normalizr"
import { randomUUID } from 'crypto'
import fs from 'fs';

async function read() {
    try {
        const autorSchema = new schema.Entity('autores', {}, {idAttribute: 'email' });
        const mensajeSchema = new schema.Entity('mensajes', {
            autor: autorSchema,
        });
        const comentariosSchema = new schema.Array(mensajeSchema)
        const data = JSON.parse(await fs.promises.readFile(`./mensajes.txt`,'utf-8'))
        const normalizeMensajes = normalize(data, comentariosSchema);
        return normalizeMensajes
    } catch (err) {
        return(err)
    }
}

async function add(data) {
    try {
        data.id = randomUUID()
        var mensajes = JSON.parse(await fs.promises.readFile(`./mensajes.txt`,'utf-8'))
        mensajes.push(data)
        fs.promises.writeFile(`./mensajes.txt`,JSON.stringify(mensajes))
    } catch (err) {
        return(err)
    }
}

export { read, add }