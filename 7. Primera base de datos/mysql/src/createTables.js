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