import * as mongoose from "mongoose";
import {Document, Schema} from "mongoose";


const InventorySchema: Schema = new Schema({
    product_id: String,
    date: Date,
    reader_id: String
});

export interface IInventory {
    product_id: String,
    date: Date,
    reader_id: String
}


export interface IInventoryDocument extends IInventory, Document {

}


export const Inventory = mongoose.model<IInventoryDocument>('inventories', InventorySchema);
