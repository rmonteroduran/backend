const fs = require('fs')

async function read(name) {
    try {
        const result = JSON.parse(await fs.promises.readFile(`./${name}.txt`,'utf-8'))
        return result
    } catch (error) {
        return(`Archivo ${name} no encontrado`)
    }
}

async function create(name, products) {
    try {
        await fs.promises.writeFile(`./${name}.txt`,JSON.stringify(products))
    } catch (error) {
        return(`Error al crear archivo ${name}`)
    }
}

class Contenedor {
    contentName
    products
    
    constructor(name) {
        this.contentName = name
        this.products = []
    }
    
    async save(title, price, thumbnail) {
        let newId
        await read(this.contentName).then(result => {
            if (result == `Archivo ${this.contentName} no encontrado`) {
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
        await create(this.contentName, this.products)
        return newId
    }

    async getById(id) {
        let resultById
        await read(this.contentName).then(result => {
            if (result == `Archivo ${this.contentName} no encontrado`) {
                resultById = result
            } else {
                let a = result.find(el => el.id === id)
                if (a) {
                    resultById = a
                } else {
                    resultById = 'Producto no encontrado'
                }
            }
        })
        return resultById
    }

    async getAll() {
        let resultAll
        await read(this.contentName).then(result => {
            resultAll = result
        })
        return resultAll
    }

    async deleteById(id) {
        let resultDeleteById
        await read(this.contentName).then(result => {
            if (result == `Archivo ${this.contentName} no encontrado`) {
                resultDeleteById = result
            } else {
                let a = result.find(el => el.id === id)
                if (a) {
                    const filterProducts = result.filter((el) => el.id !== id)
                    this.products = filterProducts
                    //create(this.contentName, this.products)
                    create(this.contentName, this.products).then(
                        resultDeleteById = 'Producto ' + a.id + ' (' + a.title + ') eliminado.'
                    )
                } else {
                    resultDeleteById = 'Producto no encontrado'
                }
            }
        })
        return resultDeleteById
    }

    async deleteAll() {
        let resultDeleteAll
        await read(this.contentName).then(result => {
            if (result == `Archivo ${this.contentName} no encontrado`) {
                resultDeleteAll = result
            } else {
                this.products = []
                //create(this.contentName, this.products)
                create(this.contentName, this.products).then(
                    resultDeleteAll = 'Todos los productos fueron eliminados'
                )
            }
        })
        return resultDeleteAll
    }
}


async function main() {
    //creo el contenedor
    const c1 =  new Contenedor('productos')
    
    //agrego productos
    console.log(await c1.save('coca cola',170,'https://jumboargentina.com/coca'))
    console.log(await c1.save('sprite',170,'https://jumboargentina.com/sprite'))
    
    //get con id
    console.log(await c1.getById(1))
    
    //delete by id
    console.log(await c1.deleteById(2))
    
    //get all
    console.log(await c1.getAll())
    
    //agrego mas productos
    console.log(await c1.save('fanta',170,'https://jumboargentina.com/fanta'))
    console.log(await c1.save('pepsi',170,'https://jumboargentina.com/pepsi'))

    //get all
    console.log(await c1.getAll())
    
    //delete all
    //await c1.deleteAll()
}

main()