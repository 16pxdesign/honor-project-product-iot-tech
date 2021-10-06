
import EventEmitter from "events";
require('dotenv').config()

export interface Client {
    user: string,
    socket: string,
    app: string
}

/**
 * Inner helper class to store current state of readers listeners.
 * */
class Listener {
    public callback: Function; //Function reference to handle listener
    public type: string; //Listener type ex. 'data'
    public reader: any;  //Exact reader path
    public client: Client; //Client name who call it
    public unique_id: string; //Client name who call it
    public timeout : any = undefined;

    constructor(reader: any, type: string, callback: Function, client: Client, unique_id: string) {
        this.callback = callback;
        this.type = type;
        this.reader = reader;
        this.client = client;
        this.unique_id = unique_id;
    }
}


/**
 * Class to register listeners
 * */
export class ReaderHandler extends EventEmitter {
    private static instance: ReaderHandler; //Singleton instance
    private _arr: Array<Listener>; //Store listeners assigned to devices
    max_listeners = process.env.MAX_LISTENERS || 10
    private constructor(arr: Array<Listener>) {
        super()
        this._arr = arr;
    }

    /** Singleton get instance */
    public static getInstance(reset?: boolean): ReaderHandler {
        if (reset) {
            ReaderHandler.instance = new ReaderHandler(new Array<Listener>());
        }
        if (!ReaderHandler.instance) {
            ReaderHandler.instance = new ReaderHandler(new Array<Listener>());
        }
        return ReaderHandler.instance;
    }


    public async setValidatedListener(reader: any, type: string, callback: Function, client: any, listener_id: string, timeout?: number) {
        const this_class = this;
        return new Promise(async function (resolve, reject) {
            //validate
            let errors: any = await this_class.validation(reader, client, listener_id);

            //check validation result
            errors.forEach((error: Error) => {
                switch (error.constructor) {
                    case  UniqueListenerExist: //perform action if listener already exist dor particular transaction
                        //throw error;
                        console.log(error.message)
                        ReaderHandler.getInstance().deleteForReplaceById(listener_id)
                        setTimeout(() => resolve( this_class.setValidatedListener(reader, type, callback,  client, listener_id, timeout)),1000)
                        break

                    case MaximumListenerExceeded: //perform action if max listeners are set
                        console.log('WARN: Client overload - waiting to free listeners')
                        setTimeout(() => resolve( this_class.setValidatedListener(reader, type, callback,  client, listener_id, timeout)),1000)
                        break

                    case ListenerForClientReaderExist: //perform action if similar listener is already running for client
                        console.log('WARN: Lister for reader and client working already SKIP')
                        errors.splice(errors.indexOf(error), 1);
                        break;
                }
            })

            //pass validation
            if (!(errors.length > 0)) {
                //set Listener
                let listener = await this_class.setLister(reader, type, callback, client, listener_id, timeout);
                resolve(listener)
            }


        })

    }

    /** check is new listener meet requirements */
    public async validation(reader: any, client: any, listener_id: string) {
        let errors: Array<Error> = [];
        if (this.isMax(reader)) {
            errors.push(new MaximumListenerExceeded('To many listener for now'))
        }
        //check is listener exist by id - need be unique
        if (this.isExistUnique(listener_id))
            errors.push(new UniqueListenerExist('Listener exist with this id'))
        //check is client got listener
        if (this.isExist(reader, client)) //TODO --optional, --how to handle --loop creating listener (hold retrieving messages - not best)
            errors.push(new ListenerForClientReaderExist('WARN: Particular listener exist for read and client'))
        return errors
    }

    /** add listener to the reader and register it in arr */
    public async setLister(reader: any, type: string, callback: Function, client: any, listener_id: string, timeout?: number) {
        //set max amount of active listener [warning message]
        reader.setMaxListeners(parseInt(this.max_listeners.toString()));
        //set listener for reader
        reader.addListener(type, callback);

        //add record to array
        let listener = new Listener(reader, type, callback, client, listener_id);
        this._arr.push(listener)
        console.log('listener created')
        //set timeout if required
        if (timeout)
            listener.timeout = setTimeout(() => {
                console.log('Timeout for listener %s with number %s %s', listener_id)
                this.deleteListener(reader, client, type, listener_id)
            },timeout)

        return listener

    }

    /** delete listener to the reader and unregister it in arr */
    public deleteListener(reader: any, client: Client, type: string, listener_id?: string) {
        console.log('deleteListener')
        let index: number; //index of selected listener

        if (listener_id) //if got reference to listener
            index = this._arr.findIndex(x => x.unique_id == listener_id);
        else
            index = this._arr.findIndex(x => x.client.user === client.user && x.type === type && x.reader.path == reader.path);

        if (index > -1) {
            let listener: Listener = this._arr[index];
            if(listener.timeout)
                clearTimeout(listener.timeout)
            reader.removeListener(type, listener.callback);
            this._arr.splice(index, 1);
            this.emit('removed', listener.reader.path, listener.client, listener.type, listener.unique_id)
        }else{
            //TODO handle if reader is not exist.
        }
    }

    public deleteForReplaceById(id: any) {
        console.log('deleteForReplaceById')
        const index = this._arr.findIndex(x => x.unique_id == id);
        if (index > -1) {
            let listener: Listener = this._arr[index];
            if(listener.timeout)
                clearTimeout(listener.timeout)
            listener.reader.removeListener(listener.type, listener.callback);
            this._arr.splice(index, 1);
            this.emit('replace', listener.reader.path, listener.client, listener.type, listener.unique_id)
        }
        console.log('Duplicate removed')
    }

    /** check is Lister exist for particular client and reader*/
    public isExist(reader: any, client: Client,): boolean {
        const filter: Array<Listener> = this._arr.filter(x => x.client == client);
        return filter.length > 0
    }

    /** check is Lister unique exist for particular client and reader*/
    public isExistUnique(id: string) {
        const filter: Array<Listener> = this._arr.filter(x => x.unique_id == id);
        return filter.length > 0
    }

    /** check listener max instances (default: 10 per reader) */
    public isMax(reader: any): boolean {
        if(this.max_listeners == 0)
            return false;
        const filter: Array<Listener> = this._arr.filter(x => x.reader.path == reader.path);
        return filter.length >= this.max_listeners;
    }

    /** Remove all listeners */
    public empty(): void {
        for (let i = (this._arr.length - 1); i > -1; i--) {
            let item = this._arr[i];
            this.deleteListener(item.reader, item.client, item.type);
        }
    }

    /** return list of listeners */
    public getListeners(): Array<Listener> {
        return this._arr;
    }


}

/** Errors for handler */
export class UniqueListenerExist extends Error {
}

export class MaximumListenerExceeded extends Error {
}

export class ListenerForClientReaderExist extends Error {
}


