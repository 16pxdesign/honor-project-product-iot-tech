import { IEvent } from "../../../../escore/build";
export interface ProductScannedEvent extends IEvent {
    product_id: string;
    product_tx: string;
    device_mac: string;
    device_name: string;
    product_rssi: string;
    reader_id: string;
    reader_type: string;
    client: string;
    date: Date;
}
