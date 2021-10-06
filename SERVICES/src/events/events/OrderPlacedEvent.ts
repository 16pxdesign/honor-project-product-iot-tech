import {IEvent} from "../../../../escore/build";
import {IProduct} from "../../models/Product";

export interface OrderPlacedEvent extends IEvent{
    products: [IProduct] // ID or any
    user_id: String
    date: Date
    approved: boolean,
}

