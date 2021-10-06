import * as mongoose from "mongoose";
import {Document, Schema} from "mongoose";


const StockSchema: Schema = new Schema({
    product_id: String,
});

export interface IStock {
    product_id: String,
}


export interface IStockDocument extends IStock, Document {

}


export const Stock = mongoose.model<IStockDocument>('stocks', StockSchema);
