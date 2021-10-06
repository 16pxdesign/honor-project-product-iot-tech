import { ICommand } from "../../../../escore/build";
export interface ProductScanCommand extends ICommand {
    client: string;
    data: any;
    transaction: string;
}
