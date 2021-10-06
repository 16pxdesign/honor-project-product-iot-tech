import * as mongoose from "mongoose";
import {Schema, Document} from "mongoose";

const ProductInfoSchema: Schema = new Schema({
    product_id: String,
    product_id_type: String,
    product_name: String,
    price: String,
    //etc.
});

export interface IProductInfo {
    product_id: String,
    product_id_type: String,
    product_name: String,
    price: String,
    //etc.
}

export interface ProductInfoDocument extends IProductInfo, Document {

}


export const ProductInfo = mongoose.model<ProductInfoDocument>('ProductInfos', ProductInfoSchema);
