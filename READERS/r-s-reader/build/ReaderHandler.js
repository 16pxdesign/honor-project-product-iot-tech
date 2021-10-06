"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerForClientReaderExist = exports.MaximumListenerExceeded = exports.UniqueListenerExist = exports.ReaderHandler = void 0;
const events_1 = __importDefault(require("events"));
require('dotenv').config();
/**
 * Inner helper class to store current state of readers listeners.
 * */
class Listener {
    constructor(reader, type, callback, client, unique_id) {
        this.timeout = undefined;
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
class ReaderHandler extends events_1.default {
    constructor(arr) {
        super();
        this.max_listeners = process.env.MAX_LISTENERS || 10;
        this._arr = arr;
    }
    /** Singleton get instance */
    static getInstance(reset) {
        if (reset) {
            ReaderHandler.instance = new ReaderHandler(new Array());
        }
        if (!ReaderHandler.instance) {
            ReaderHandler.instance = new ReaderHandler(new Array());
        }
        return ReaderHandler.instance;
    }
    setValidatedListener(reader, type, callback, client, listener_id, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            const this_class = this;
            return new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    //validate
                    let errors = yield this_class.validation(reader, client, listener_id);
                    //check validation result
                    errors.forEach((error) => {
                        switch (error.constructor) {
                            case UniqueListenerExist: //perform action if listener already exist dor particular transaction
                                //throw error;
                                console.log(error.message);
                                ReaderHandler.getInstance().deleteForReplaceById(listener_id);
                                setTimeout(() => resolve(this_class.setValidatedListener(reader, type, callback, client, listener_id, timeout)), 1000);
                                break;
                            case MaximumListenerExceeded: //perform action if max listeners are set
                                console.log('WARN: Client overload - waiting to free listeners');
                                setTimeout(() => resolve(this_class.setValidatedListener(reader, type, callback, client, listener_id, timeout)), 1000);
                                break;
                            case ListenerForClientReaderExist: //perform action if similar listener is already running for client
                                console.log('WARN: Lister for reader and client working already SKIP');
                                errors.splice(errors.indexOf(error), 1);
                                break;
                        }
                    });
                    //pass validation
                    if (!(errors.length > 0)) {
                        //set Listener
                        let listener = yield this_class.setLister(reader, type, callback, client, listener_id, timeout);
                        resolve(listener);
                    }
                });
            });
        });
    }
    /** check is new listener meet requirements */
    validation(reader, client, listener_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let errors = [];
            if (this.isMax(reader)) {
                errors.push(new MaximumListenerExceeded('To many listener for now'));
            }
            //check is listener exist by id - need be unique
            if (this.isExistUnique(listener_id))
                errors.push(new UniqueListenerExist('Listener exist with this id'));
            //check is client got listener
            if (this.isExist(reader, client)) //TODO --optional, --how to handle --loop creating listener (hold retrieving messages - not best)
                errors.push(new ListenerForClientReaderExist('WARN: Particular listener exist for read and client'));
            return errors;
        });
    }
    /** add listener to the reader and register it in arr */
    setLister(reader, type, callback, client, listener_id, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            //set max amount of active listener [warning message]
            reader.setMaxListeners(parseInt(this.max_listeners.toString()));
            //set listener for reader
            reader.addListener(type, callback);
            //add record to array
            let listener = new Listener(reader, type, callback, client, listener_id);
            this._arr.push(listener);
            console.log('listener created');
            //set timeout if required
            if (timeout)
                listener.timeout = setTimeout(() => {
                    console.log('Timeout for listener %s with number %s %s', listener_id);
                    this.deleteListener(reader, client, type, listener_id);
                }, timeout);
            return listener;
        });
    }
    /** delete listener to the reader and unregister it in arr */
    deleteListener(reader, client, type, listener_id) {
        console.log('deleteListener');
        let index; //index of selected listener
        if (listener_id) //if got reference to listener
            index = this._arr.findIndex(x => x.unique_id == listener_id);
        else
            index = this._arr.findIndex(x => x.client.user === client.user && x.type === type && x.reader.path == reader.path);
        if (index > -1) {
            let listener = this._arr[index];
            if (listener.timeout)
                clearTimeout(listener.timeout);
            reader.removeListener(type, listener.callback);
            this._arr.splice(index, 1);
            this.emit('removed', listener.reader.path, listener.client, listener.type, listener.unique_id);
        }
        else {
            //TODO handle if reader is not exist.
        }
    }
    deleteForReplaceById(id) {
        console.log('deleteForReplaceById');
        const index = this._arr.findIndex(x => x.unique_id == id);
        if (index > -1) {
            let listener = this._arr[index];
            listener.reader.removeListener(listener.type, listener.callback);
            this._arr.splice(index, 1);
            this.emit('replace', listener.reader.path, listener.client, listener.type, listener.unique_id);
        }
        console.log('Duplicate removed');
    }
    /** check is Lister exist for particular client and reader*/
    isExist(reader, client) {
        const filter = this._arr.filter(x => x.client == client);
        return filter.length > 0;
    }
    /** check is Lister unique exist for particular client and reader*/
    isExistUnique(id) {
        const filter = this._arr.filter(x => x.unique_id == id);
        return filter.length > 0;
    }
    /** check listener max instances (default: 10 per reader) */
    isMax(reader) {
        if (this.max_listeners == 0)
            return false;
        const filter = this._arr.filter(x => x.reader.path == reader.path);
        return filter.length >= this.max_listeners;
    }
    /** Remove all listeners */
    empty() {
        for (let i = (this._arr.length - 1); i > -1; i--) {
            let item = this._arr[i];
            this.deleteListener(item.reader, item.client, item.type);
        }
    }
    /** return list of listeners */
    getListeners() {
        return this._arr;
    }
}
exports.ReaderHandler = ReaderHandler;
/** Errors for handler */
class UniqueListenerExist extends Error {
}
exports.UniqueListenerExist = UniqueListenerExist;
class MaximumListenerExceeded extends Error {
}
exports.MaximumListenerExceeded = MaximumListenerExceeded;
class ListenerForClientReaderExist extends Error {
}
exports.ListenerForClientReaderExist = ListenerForClientReaderExist;
