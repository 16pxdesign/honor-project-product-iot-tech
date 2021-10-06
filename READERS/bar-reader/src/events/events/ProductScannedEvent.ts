import {IEvent} from "../../../../escore/build";

/**
 * The interface determines the structure of emitted event
 * Event dedicated to presents scanned product.
 */
export interface ProductScannedEvent extends IEvent {
    product_id: string //Scanned product id
    reader_id: string //Reader client id
    reader_type: string //Reader client type
    client: string //Requested client
    date: Date //Scan time
}

