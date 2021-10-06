import {ProductScanCommand} from "../commands/ProductScanCommand";
import {ProductScannedEvent} from "../events/ProductScannedEvent";
import {EventType, ICommandHandler} from "../../../../escore/build";
require('dotenv').config()

export class ProductScanHandler implements ICommandHandler<ProductScanCommand, ProductScannedEvent> {

    async execute(command: ProductScanCommand): Promise<ProductScannedEvent> {
        let id="", rssi ="", tx = "";


        const event: ProductScannedEvent = {
            client: command.client,
            product_id: command.data.id,
            product_extra: command.data.blocks,
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


     parse(data: Buffer, set?: Set<any>): Array<Buffer> | undefined {

        if (data[0] === 0) {
            return undefined;
        } else {
            //console.log(data.toString('hex'))
            if (data[0] === 0x43 && data[1] === 0x54 && data[5] === 0x45) {
                const id = data.slice(18, 30);
                const rssi = data.slice(30, 31);
               // console.log('id? %s', id.toString('hex'))
                //console.log('rssi? %s', rssi.toString('hex'))
                return Array<Buffer>(id,rssi);
            } else {
                return undefined
            }
        }
    }

}