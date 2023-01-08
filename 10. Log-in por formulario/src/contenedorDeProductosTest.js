import faker from 'faker'
faker.locale = 'es'

const productos = []
productos.push({title: faker.commerce.product(), price: faker.commerce.price(100, 200, 0), thumbnail: faker.image.abstract(640, 480, true)})
productos.push({title: faker.commerce.product(), price: faker.commerce.price(100, 200, 0), thumbnail: faker.image.abstract(640, 480, true)})
productos.push({title: faker.commerce.product(), price: faker.commerce.price(100, 200, 0), thumbnail: faker.image.abstract(640, 480, true)})
productos.push({title: faker.commerce.product(), price: faker.commerce.price(100, 200, 0), thumbnail: faker.image.abstract(640, 480, true)})
productos.push({title: faker.commerce.product(), price: faker.commerce.price(100, 200, 0), thumbnail: faker.image.abstract(640, 480, true)})

export const contenedorDeProductosTest = productos;