/// <reference types="node" />
import EventEmitter from "events";
export default class Device extends EventEmitter {
    path: any;
    spi: any;
    dv: any;
    private interval;
    constructor();
    toHex(d: any): string;
    open(err: any): Promise<void>;
}
