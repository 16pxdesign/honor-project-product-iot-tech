import * as mongoose from "mongoose";
import {Schema, Document} from "mongoose";
import {IProduct} from "./Product";


const TransactionSchema: Schema = new Schema({
    user_id: String,
    transaction_id: String,
    products: [{type: Schema.Types.ObjectId, ref: 'products'}],
    date: Date,
    approved: {type: Boolean, default: false},
    reason: [String]

});

export interface ITransaction {
    user_id: String,
    transaction_id: String,
    products: [IProduct?],
    date: Date,
    approved: boolean,
    reason?: [String]
}

export interface ITransactionDocument extends ITransaction, Document {

}


export const Transaction = mongoose.model<ITransactionDocument>('transactions', TransactionSchema);
