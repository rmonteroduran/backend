import { clienteSql as knex } from './clienteSql.js'

knex.schema.hasTable('productos')
    .then(exists => {
        if (!exists) {
            knex.schema.createTable('productos', tabla => {
                tabla.string('id'),
                    tabla.string('title'),
                    tabla.decimal('price'),
                    tabla.string('thumbnail')
            })
                .then(() => {
                    console.log('tabla "productos" creada!')
                })
        } else {
            console.log('la tabla "productos" ya existe. no se realizaron cambios')
        }
    })
    .finally(() => {
        knex.destroy()
    })

knex.schema.hasTable('mensajes')
    .then(exists => {
        if (!exists) {
            knex.schema.createTable('mensajes', tabla => {
                tabla.string('id'),
                    tabla.string('autor'),
                    tabla.string('texto'),
                    tabla.datetime('fecha')
            })
                .then(() => {
                    console.log('tabla "mensajes" creada!')
                })
        } else {
            console.log('la tabla "mensajes" ya existe. no se realizaron cambios')
        }
    })
    .finally(() => {
        knex.destroy()
    })