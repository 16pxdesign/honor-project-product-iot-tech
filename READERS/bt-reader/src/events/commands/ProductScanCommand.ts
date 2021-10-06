import {ICommand} from "../../../../escore/build";
import {Peripheral} from "@abandonware/noble";

/**
 * The interface determines the structure of the command to be executed.
 * Command dedicated to scanned products
 */
export interface ProductScanCommand extends ICommand {
    client: string
    data: Peripheral
    transaction: string
}