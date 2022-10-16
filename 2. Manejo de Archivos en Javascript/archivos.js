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
    
    constructor(name) {
        this.contentName = name
        read(name)
            .then(result => {
                if (result == 'error') {
                    create(name, [])
                    console.log('Contenedor creado')
                } else {
                    console.log('Contenedor encontrado')
                }
            })
    }
    
    save(title, price, thumbnail) {
        read(this.contentName).then(result => {
            if (result == 'error') {
                console.log('No se encuentra archivo')
            } else {
                const ids = result.map(obj => obj.id)
                const maxId = Math.max(...ids)
                if (maxId == -Infinity) {
                    result.push({id: 1, title: title, price: price, thumbnail: thumbnail})
                } else {
                    result.push({id: maxId + 1, title: title, price: price, thumbnail: thumbnail})
                }
                create(this.contentName, result)
                console.log(`Producto ${title} agregado`)
            }
        })
    }

    getById(id) {
        read(this.contentName).then(result => {
            if (result == 'error') {
                console.log('No se encuentra archivo')
            } else {
                console.log(result)
                let a = result.find(el => el.id === id)
                if (a) {
                    console.log('El producto ' + a.id + ' es ' + a.title) 
                } else {
                    console.log('Producto no encontrado')
                }
            }
        })
    }

    getAll() {
        read(this.contentName).then(result => {
            if (result == 'error') {
                console.log('No se encuentra archivo')
            } else {
                console.log(result)
            }
        })
    }

    deleteById(id) {
        read(this.contentName).then(result => {
            if (result == 'error') {
                console.log('No se encuentra archivo')
            } else {
                let a = result.find(el => el.id === id)
                if (a) {
                    const filterProducts = result.filter((el) => el.id !== id)
                    this.products = filterProducts
                    create(this.contentName, this.products)
                    console.log('Producto ' + a.id + ' (' + a.title + ') eliminado.')
                } else {
                    console.log('Producto no encontrado')
                }
            }
        })
    }

    deleteAll() {
        read(this.contentName).then(result => {
            if (result == 'error') {
                console.log('No se encuentra archivo')
            } else {
                this.products = []
                create(this.contentName, this.products)
                console.log('Todos los productos eliminados')
            }
        })
    }
}

//creo el contenedor
const c1 = new Contenedor('productos')

//agrego productos
c1.save('coca cola',170,'https://jumboargentina.com/coca')
c1.save('sprite',150,'https://jumboargentina..com/sprite')

//get con id
c1.getById(1)