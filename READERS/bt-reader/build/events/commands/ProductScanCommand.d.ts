import { ICommand } from "../../../../escore/build";
import { Peripheral } from "@abandonware/noble";
export interface ProductScanCommand extends ICommand {
    client: string;
    data: Peripheral;
    transaction: string;
}
