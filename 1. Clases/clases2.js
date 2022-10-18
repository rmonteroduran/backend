class Contenedor {
    products

    constructor(title, price, thumbnail) {
        this.products = [{id: 1, title: title, price: price, thumbnail: thumbnail}]
    }

    save(title, price, thumbnail) {
        const ids = this.products.map(obj => obj.id)
        const maxId = Math.max(...ids)
        this.products.push({id: maxId + 1, title: title, price: price, thumbnail: thumbnail})
        return `Producto agregado, id: ${maxId + 1}`
    }

    getById(id) {
        let a = this.products.find(el => el.id === id)
        if (a) {
            return 'El producto ' + a.id + ' es ' + a.title
        } else {
            return 'Producto no encontrado.'
        }
    }

    getAll() {
        return this.products
    }

    deleteById(id) {
        let a = this.products.find(el => el.id === id)
        if (a) {
            const filterProducts = this.products.filter((el) => el.id !== id)
            this.products = filterProducts
            return 'Producto ' + a.id + ' (' + a.title + ') eliminado.'
        } else {
            return 'Producto no encontrado.'
        }
    }

    deleteAll() {
        this.products = []
        return 'Productos eliminados.'
    }

}

//creo el contenedor
const c1 = new Contenedor(
    1,
    'coca cola',
    170,
    'https://www.cocacola.es/content/dam/one/es/es2/coca-cola/products/productos/dic-2021/CC_Origal.jpg'
)

//guardo nuevo producto en contenedor
console.log(c1.save(
    2,
    'sprite',
    170,
    'https://preview.free3d.com/img/2018/04/2279507753523218166/8x6qj8yj-900.jpg'
))

//obtengo todo el contenedor
console.log(c1.getAll())

//obtengo el producto con id 1
console.log(c1.getById(1))

//elimino el producto con id 1
console.log(c1.deleteById(1))

//obtengo todo el contenedor
console.log(c1.getAll())

//elimino todos los productos del contenedor
console.log(c1.deleteAll())

//obtengo todo el contenedor
console.log(c1.getAll())
