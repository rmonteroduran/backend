import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    title: { type: String, require: true},
    price: { type: String, require: true},
    thumbnail: { type: String, require: true},
});

export interface Product extends mongoose.Document {
    id: string;
    title: string;
    price: string;
    thumbnail: string;
}
