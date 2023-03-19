export class ProductsDto {
    constructor({ _id, title, price, thumbnail }) {
        this._id = _id;
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
    }
}