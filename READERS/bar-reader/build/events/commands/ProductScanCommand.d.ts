import { ICommand } from "../../../../escore/build";
/**
 * The interface determines the structure of the command to be executed.
 * Command dedicated to scanned products
 */
export interface ProductScanCommand extends ICommand {
    client: string;
    data: any;
    transaction: string;
}
