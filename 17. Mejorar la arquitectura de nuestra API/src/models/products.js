import { ProductsDto } from '../dtos/productsDto.js'

export class Product {
    #_id
    #title
    #price
    #thumbnail

    constructor({ _id, title, price, thumbnail }) {
        this.#_id = _id
        this.#title = title
        this.#price = price
        this.#thumbnail = thumbnail
    }

    get id() {
        return this.#_id
    }

    get title() {
        return this.#title
    }

    get price() {
        return this.#price
    }

    datos() {
        return new ProductsDto({
            _id: this.#_id,
            title: this.#title,
            price: this.#price,
            thumbnail: this.#thumbnail,
        })
    }
}