import {IEvent} from "../../../../escore/build";

/**
 * The interface determines the structure of emitted event
 * Event dedicated to presents scanned product.
 */
export interface ProductScannedEvent extends IEvent {
    product_id: string //Scanned product id
    product_tx: string //Tag power tx
    device_mac: string //Tag mac address
    device_name: string //Tag name
    product_rssi: string //Tag rssi power
    reader_id: string //Reader client id
    reader_type: string //Reader client type
    client: string //Requested client
    date: Date //Scan time
}

