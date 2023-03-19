import { ProductsList } from '../repositories/productsList/index.js'

class ProductService {
    async guardar(producto) {
        await ProductsList.guardar(producto)
        .then(result => {
            return result
        })
    }
    async buscar() {
        const prods = await ProductsList.buscar()
        if (prods) {
            return prods
        }
    }
}

export const ProductsService = new ProductService()