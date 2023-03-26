import { UsersDto } from '../dtos/usersDto.js'
import {randomUUID} from 'crypto'

export class User {
    #username
    #password
    #id

    constructor({id = randomUUID(), username, password }) {
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