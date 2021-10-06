/// <reference types="node" />
import EventEmitter from "events";
interface Client {
    user: string;
    socket: string;
    app: string;
}
/**
 * Inner helper class to store current state of readers listeners.
 * */
declare class Listener {
    callback: Function;
    type: string;
    reader: any;
    client: Client;
    unique_id: string;
    timeout: any;
    constructor(reader: any, type: string, callback: Function, client: Client, unique_id: string);
}
/**
 * Class to register listeners
 * */
export declare class ReaderHandler extends EventEmitter {
    private static instance;
    private _arr;
    max_listeners: string | number;
    private constructor();
    /** Singleton get instance */
    static getInstance(reset?: boolean): ReaderHandler;
    setValidatedListener(reader: any, type: string, callback: Function, client: any, listener_id: string, timeout?: number): Promise<unknown>;
    /** check is new listener meet requirements */
    validation(reader: any, client: any, listener_id: string): Promise<Error[]>;
    /** add listener to the reader and register it in arr */
    setLister(reader: any, type: string, callback: Function, client: any, listener_id: string, timeout?: number): Promise<Listener>;
    /** delete listener to the reader and unregister it in arr */
    deleteListener(reader: any, client: Client, type: string, listener_id?: string): void;
    deleteForReplaceById(id: any): void;
    /** check is Lister exist for particular client and reader*/
    isExist(reader: any, client: Client): boolean;
    /** check is Lister unique exist for particular client and reader*/
    isExistUnique(id: string): boolean;
    /** check listener max instances (default: 10 per reader) */
    isMax(reader: any): boolean;
    /** Remove all listeners */
    empty(): void;
    /** return list of listeners */
    getListeners(): Array<Listener>;
}
/** Errors for handler */
export declare class UniqueListenerExist extends Error {
}
export declare class MaximumListenerExceeded extends Error {
}
export declare class ListenerForClientReaderExist extends Error {
}
export {};
