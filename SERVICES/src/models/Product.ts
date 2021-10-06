import * as mongoose from "mongoose";
import {Schema, Document} from "mongoose";

const ProductSchema: Schema = new Schema({
    product_id: String,
    product_name: String,

});

export interface IProduct {
    product_id: String,
    product_name?: String,
}

export interface ProductDocument extends IProduct, Document {

}


export const Product = mongoose.model<ProductDocument>('products', ProductSchema);
