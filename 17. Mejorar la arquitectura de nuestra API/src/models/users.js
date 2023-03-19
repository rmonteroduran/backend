import { UsersDto } from '../dtos/usersDto.js'

export class User {
    #username
    #password
    #id

    constructor({ _id, title, price, thumbnail }) {
        this.#username = username
        this.#password = password
        this.#id = id
    }

    get username() {
        return this.#username
    }

    datos() {
        return new UsersDto({
            username: this.#username,
            password: this.#password,
            id: this.#id,
        })
    }
}