import {ICommand} from "../../../../escore/build";


export interface StockStatusCommand extends ICommand{
    products: String[];
    transaction: string
    reason: string[],
}