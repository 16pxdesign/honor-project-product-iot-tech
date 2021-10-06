import {IEvent} from "../../../../escore/build";
import {IProduct} from "../../models/Product";

export interface StockStatusEvent extends IEvent{
    date: Date
    transaction: string
    approved: boolean,
    products: String[]
    reason?: string[],
}

