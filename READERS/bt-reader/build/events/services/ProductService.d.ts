import { ProductScanCommand } from "../commands/ProductScanCommand";
import { BaseCommandService, ICommand, IEvent, IState, IStore } from "../../../../escore/build";
export declare class ProductService extends BaseCommandService<ICommand, IEvent, IState> {
    constructor(store: IStore);
    scanned(c: ProductScanCommand): Promise<void | IState>;
}
