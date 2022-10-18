const fs = require('fs')

async function read(name) {
    try {
        const result = JSON.parse(await fs.promises.readFile(`./${name}.txt`,'utf-8'))
        return result
    } catch (error) {
        return 'error'
    }
}

async function create(name, products) {
    try {
        await fs.promises.writeFile(`./${name}.txt`,JSON.stringify(products))
    } catch (error) {
        return error
    }
}

class Contenedor {
    contentName
    products
    
    constructor(name) {
        this.contentName = name
        this.products = []
        console.log('Contenedor creado')
    }
    
    async save(title, price, thumbnail) {
        let newId
        await read(this.contentName).then(result => {
            if (result == 'error') {
                if (this.products.length == 0) {
                    newId = 1
                } else {
                    const ids = this.products.map(obj => obj.id)
                    const maxId = Math.max(...ids)
                    newId = maxId + 1
                }
            } else {
                if (result.length == 0) {
                    newId = 1
                } else {
                    const ids = result.map(obj => obj.id)
                    const maxId = Math.max(...ids)
                    newId = maxId + 1
                    this.products = result
                }                
            }
            this.products.push({id: newId, title: title, price: price, thumbnail: thumbnail})
        })
        await create(this.contentName, this.products).then(
            console.log(`Producto ${title} agregado, id: ${newId}`)
        )
    }

    async getById(id) {
        await read(this.contentName).then(result => {
            if (result == 'error') {
                console.log('No se encuentra archivo')
            } else {
                let a = result.find(el => el.id === id)
                if (a) {
                    console.log('El producto ' + a.id + ' es ' + a.title) 
                } else {
                    console.log('Producto no encontrado')
                }
            }
        })
    }

    async getAll() {
        await read(this.contentName).then(result => {
            if (result == 'error') {
                console.log('No se encuentra archivo')
            } else {
                console.log(result)
            }
        })
    }

    async deleteById(id) {
        await read(this.contentName).then(result => {
            if (result == 'error') {
                console.log('No se encuentra archivo')
            } else {
                let a = result.find(el => el.id === id)
                if (a) {
                    const filterProducts = result.filter((el) => el.id !== id)
                    this.products = filterProducts
                    //create(this.contentName, this.products)
                    create(this.contentName, this.products).then(
                        console.log('Producto ' + a.id + ' (' + a.title + ') eliminado.')
                    )
                } else {
                    console.log('Producto no encontrado')
                }
            }
        })
    }

    async deleteAll() {
        await read(this.contentName).then(result => {
            if (result == 'error') {
                console.log('No se encuentra archivo')
            } else {
                this.products = []
                //create(this.contentName, this.products)
                create(this.contentName, this.products).then(
                    console.log('Todos los productos eliminados')
                )
            }
        })
    }
}


async function main() {
    //creo el contenedor
    const c1 =  await new Contenedor('productos')
    
    //agrego productos
    await c1.save('coca cola',170,'https://jumboargentina.com/coca')
    await c1.save('sprite',170,'https://jumboargentina.com/sprite')
    
    //get con id
    await c1.getById(2)
    
    //get all
    await c1.getAll()
    
    //delete by id
    await c1.deleteById(1)

    //agrego mas productos
    await c1.save('fanta',170,'https://jumboargentina.com/fanta')
    await c1.save('pepsi',170,'https://jumboargentina.com/pepsi')

    //get all
    await c1.getAll()
    
    //delete all
    //await c1.deleteAll()
}

main()