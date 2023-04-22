import { ProductsDto } from '../dtos/productsDto.js'
import { randomUUID } from 'crypto'

export class Product {
    #_id
    #name
    #description
    #price
    #image

    constructor({name, description, price, image }) {
        this.#_id = randomUUID()
        this.#name = name
        this.#description = description
        this.#price = price
        this.#image = image
    }

    get id() {
        return this.#_id
    }

    get name() {
        return this.#name
    }

    get price() {
        return this.#price
    }

    datos() {
        return new ProductsDto({
            _id: this.#_id,
            name: this.#name,
            description: this.#description,
            price: this.#price,
            image: this.#image,
        })
    }
}