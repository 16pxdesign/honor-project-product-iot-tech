import {IState} from "../../../../escore/build";
import {ITransaction} from "../../models/Transaction";
import {IStock} from "../../models/Stock";


export interface StockState extends IState{
    product_ids: String[]
}

