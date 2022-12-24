import { normalize, schema } from "normalizr"
import { randomUUID } from 'crypto'
import fs from 'fs';

async function read() {
    try {
        const autorSchema = new schema.Entity('autores', {}, {idAttribute: 'email' });
        const mensajeSchema = new schema.Entity('mensajes', {
            autor: autorSchema,
        });
        const comentariosSchema = new schema.Entity('mensajes', {
            autor: autorSchema,
        }, {idAttribute: 'id' });
        const data = JSON.parse(await fs.promises.readFile(`./mensajes.txt`))
        const normalizeMensajes = normalize(data, mensajeSchema);
        console.log(normalizeMensajes)
        return normalizeMensajes
    } catch (err) {
        return(err)
    }
}

async function add(data) {
    try {
        data.id = randomUUID()
        //const mensajes = JSON.parse(await fs.promises.readFile(`./mensajes.txt`))
        fs.promises.writeFile(`./mensajes.txt`,JSON.stringify(data))
    } catch (err) {
        return(err)
    }
}

export { read, add }