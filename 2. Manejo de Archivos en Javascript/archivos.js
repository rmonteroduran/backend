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
        await read(this.contentName).then(result => {
            if (result == 'error') {
                if (this.products.length == 0) {
                    this.products.push({id: 1, title: title, price: price, thumbnail: thumbnail})
                    fs.writeFileSync(`./${this.contentName}.txt`,JSON.stringify(this.products))
                    console.log(`Producto ${title} agregado, id: 1`)//
                } else {
                    const ids = this.products.map(obj => obj.id)
                    const maxId = Math.max(...ids)
                    this.products.push({id: maxId + 1, title: title, price: price, thumbnail: thumbnail})
                    fs.writeFileSync(`./${this.contentName}.txt`,JSON.stringify(this.products))
                    console.log(`Producto ${title} agregado, id: ${maxId + 1}`)//
                }
            } else {
                if (result.length == 0) {
                    this.products.push({id: 1, title: title, price: price, thumbnail: thumbnail})
                    fs.writeFileSync(`./${this.contentName}.txt`,JSON.stringify(this.products))
                    console.log(`Producto ${title} agregado, id: 1`)//
                } else {
                    const ids = result.map(obj => obj.id)
                    const maxId = Math.max(...ids)
                    this.products.push(...result)
                    this.products.push({id: maxId + 1, title: title, price: price, thumbnail: thumbnail})
                    fs.writeFileSync(`./${this.contentName}.txt`,JSON.stringify(this.products))
                    console.log(`Producto ${title} agregado, id: ${maxId + 1}`)//
                }                
            }
        })
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
                    fs.writeFileSync(`./${this.contentName}.txt`,JSON.stringify(this.products))
                    console.log('Producto ' + a.id + ' (' + a.title + ') eliminado.')
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
                fs.writeFileSync(`./${this.contentName}.txt`,JSON.stringify(this.products))
                console.log('Todos los productos eliminados')
            }
        })
    }
}

//creo el contenedor
const c1 = new Contenedor('productos')

//agrego productos
c1.save('coca cola',170,'https://jumboargentina.com/coca')

//get con id
c1.getById(1)

//get all
c1.getAll()

//delete by id
//c1.deleteById(1)

//delete all
//c1.deleteAll()