import {ProductScanCommand} from "../commands/ProductScanCommand";
import {ProductScannedEvent} from "../events/ProductScannedEvent";
import {EventType, ICommandHandler} from "../../../../escore/build";

require('dotenv').config()

/**
 * Handler produce event based on command
 * Scan handler create event of scanned product.
 */
export class ProductScanHandler implements ICommandHandler<ProductScanCommand, ProductScannedEvent> {

    async execute(command: ProductScanCommand): Promise<ProductScannedEvent> {
        const event: ProductScannedEvent = {
            client: command.client,
            product_id: command.data.toString().trim(),
            reader_id: process.env.ID || "",
            reader_type: process.env.TYPE || "",
            transaction: command.transaction,
            date: new Date(),
            type: EventType.PRODUCT_SCANNED
        }
        return event;
    }


}