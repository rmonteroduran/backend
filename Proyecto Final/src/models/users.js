import { UsersDto } from '../dtos/usersDto.js'
import { randomUUID } from 'crypto'
import { passEncryptor } from '../controllers/jwt.js'

export class User {
    #_id
    #email
    #password
    #name
    #lastname
    #image
    #rol
    
    constructor({email, password, name, lastname, image, rol}) {
        this.#_id = randomUUID()
        this.#email = email
        this.#password = passEncryptor(password);
        this.#name = name
        this.#lastname = lastname
        this.#image = image
        this.#rol = rol
    }

    get email() {
        return this.#email
    }

    datos() {
        return new UsersDto({
            _id: this.#_id,
            email: this.#email,
            password: this.#password,
            name: this.#name,
            lastname: this.#lastname,
            image: this.#image,
            rol: this.#rol,
        })
    }
}