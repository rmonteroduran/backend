import { Product } from '../../models/products.js'

export class ProductList {
    #dao

    constructor(dao) {
        this.#dao = dao
    }

    async buscar() {
        const dto = await this.#dao.buscar()
        if (!dto) logger.error(`Product list Buscar - Set de datos no encontrado`)
        return dto
    }

    async buscarPorId(_id) {
        const dto = await this.#dao.buscarPorId(_id)
        if (!dto) logger.error(`Product list Buscar por id error - Id no encontrado: ${_id}`)
        return new Product(dto)
    }

    async guardar(producto) {
        const prod = await this.#dao.guardar(producto)
        return prod
    }
}