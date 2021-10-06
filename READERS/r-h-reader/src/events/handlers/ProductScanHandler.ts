import {ProductScanCommand} from "../commands/ProductScanCommand";
import {ProductScannedEvent} from "../events/ProductScannedEvent";
import {EventType, ICommandHandler} from "../../../../escore/build";
require('dotenv').config()

export class ProductScanHandler implements ICommandHandler<ProductScanCommand, ProductScannedEvent> {

    async execute(command: ProductScanCommand): Promise<ProductScannedEvent> {
        let id="", rssi ="", tx = "";

        let result = this.parse(command.data);

        if(!result)
            return Promise.reject('No data fit')
        console.log('Data fit')
        id = result[0].toString('hex');
        rssi = result[1].toString('hex');

        const event: ProductScannedEvent = {
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


     parse(data: Buffer, set?: Set<any>): Array<Buffer> | undefined {

         console.log('data in parse ', data.toString('hex'))
        if (data[0] === 0) {
            return undefined;
        } else {
            //console.log(data.toString('hex'))
            if (data[0+1] === 0x43 && data[1+1] === 0x54 && data[5+1] === 0x45) {
                console.log(true)
                const id = data.slice(18+1, 30+1);
                const rssi = data.slice(30+1, 31+1);
                const id2 = data.slice(35, 47);

                if(id.toString('hex')!==id2.toString('hex'))
                    return undefined

                console.log('id? %s', id.toString('hex'))
                console.log('id?2 %s', id2.toString('hex'))
                console.log('rssi? %s', rssi.toString('hex'))
                return Array<Buffer>(id,rssi);
            } else {
                return undefined
            }
        }
    }

}