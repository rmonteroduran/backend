export class ProductService {
    #productosDao

    constructor( productosDao ) {
        this.#productosDao = productosDao
    }

    async guardar(producto) {
        await this.#productosDao.guardar(producto)
        return producto
    }

    async buscar() {
        const prods = await this.#productosDao.buscar()
        if (prods) {
            return prods
        }
    }

    async buscarPorId(id) {
        const prods = await this.#productosDao.buscarPorId(id)
        if (prods) {
            return prods
        }
    }

    async eliminar(id) {
        const result = await this.#productosDao.eliminar(id)
        return result
    }

    async actualizar(id, dto) {
        const result = await this.#productosDao.actualizar(id, dto)
        if (result) {
            return result
        }
    }

}