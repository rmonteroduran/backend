export class ProductsDto {
    constructor({ _id, name, description, price, image }) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
    }
}