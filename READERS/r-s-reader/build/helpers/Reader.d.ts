import { ProductService } from "../events/services/ProductService";
import { ReaderService } from "../events/services/ReaderService";
export declare class Reader {
    static instance: Reader;
    id: string;
    type: string;
    device: any;
    private _kafka;
    consumer: any;
    productService: ProductService;
    readerService: ReaderService;
    private kafka_host;
    private isScanning;
    private constructor();
    /** Singleton get instance */
    static getInstance(reset?: boolean): Reader;
    /** init rs and start scanning */
    init(): Promise<boolean>;
    /** set listeners for rs device */
    setListeners(): Promise<boolean>;
    /** Wrapper function that return handler function for listener */
    getCallback(client: any, transaction?: any): Function;
    callback(client: any, data: any, transaction?: any): void;
    subscribeKafkaTopics(): Promise<void>;
    consumeKafkaMessages(): any;
    private onStartScan;
    private onStopScan;
    private onPresence;
}
