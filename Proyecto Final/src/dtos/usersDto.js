export class UsersDto {
    constructor({ _id, email, password, name, lastname, image, rol }) {
        this._id = _id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.lastname = lastname;
        this.image = image;
        this.rol = rol;
    }
}