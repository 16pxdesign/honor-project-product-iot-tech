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
        let id = "", rssi = "", tx = ""; //init
        //get tag beacon data
        let m = command.data.advertisement.manufacturerData;
        if (!m)
            return Promise.reject('No data fit')
        console.log('Data fit')
        //parse data from tag
        if (m.length > 24)
            id = m.slice(0, 24).toString('hex')
        else
            id = m.toString('hex')
        if (command.data.rssi)
            rssi = command.data.rssi.toString();
        if (m.length > 24)
            tx = m.slice(24, 25).readInt8(0).toString();

        //TODO BEACON CHECK or process by app

        const event: ProductScannedEvent = {
            device_mac: command.data.address, device_name: command.data.advertisement.localName,
            client: command.client,
            product_id: id,
            product_rssi: rssi,
            product_tx: tx,
            reader_id: process.env.ID || "",
            reader_type: process.env.TYPE || "",
            transaction: command.transaction,
            date: new Date(),
            type: EventType.PRODUCT_SCANNED
        }
        return event;
    }


}