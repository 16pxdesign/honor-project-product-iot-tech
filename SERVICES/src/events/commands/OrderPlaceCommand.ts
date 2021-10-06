import {ICommand} from "../../../../escore/build";
import {Client} from "../events/ReaderStateEvent";
import {IProduct} from "../../models/Product";


export interface OrderPlaceCommand extends ICommand{
    transaction: string
    products: [IProduct] // ID or any
    user_id: String
}