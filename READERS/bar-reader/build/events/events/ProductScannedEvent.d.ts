import { IEvent } from "../../../../escore/build";
/**
 * The interface determines the structure of emitted event
 * Event dedicated to presents scanned product.
 */
export interface ProductScannedEvent extends IEvent {
    product_id: string;
    product_tx: string;
    product_rssi: string;
    reader_id: string;
    reader_type: string;
    client: string;
    date: Date;
}
