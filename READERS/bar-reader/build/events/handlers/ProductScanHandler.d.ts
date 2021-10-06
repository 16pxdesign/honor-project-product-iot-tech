import { ProductScanCommand } from "../commands/ProductScanCommand";
import { ProductScannedEvent } from "../events/ProductScannedEvent";
import { ICommandHandler } from "../../../../escore/build";
export declare class ProductScanHandler implements ICommandHandler<ProductScanCommand, ProductScannedEvent> {
    execute(command: ProductScanCommand): Promise<ProductScannedEvent>;
}
