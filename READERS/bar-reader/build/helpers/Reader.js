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
exports.Reader = void 0;
const kafkajs_1 = require("kafkajs");
const ProductService_1 = require("../events/services/ProductService");
const ReaderService_1 = require("../events/services/ReaderService");
const EventStore_1 = require("../events/stores/EventStore");
const DeviceWrapper_1 = __importDefault(require("./DeviceWrapper"));
const ReaderHandler_1 = require("../ReaderHandler");
const build_1 = require("../../../escore/build");
require('dotenv').config();
class Reader {
    constructor(device) {
        this.id = process.env.ID || "";
        this.type = process.env.TYPE || "";
        this.kafka_host = process.env.KAFKA_HOST || "localhost:9093";
        this.isScanning = false; //redundant?
        this.device = device;
        this._kafka = new kafkajs_1.Kafka({ clientId: this.id, brokers: [this.kafka_host], retry: { retries: 100 } });
        this.productService = new ProductService_1.ProductService(new EventStore_1.EventStore(this._kafka, 'products'));
        this.readerService = new ReaderService_1.ReaderService(new EventStore_1.EventStore(this._kafka));
    }
    /** Singleton get instance */
    static getInstance(reset) {
        if (!Reader.instance || reset) {
            Reader.instance = new Reader(DeviceWrapper_1.default);
        }
        return Reader.instance;
    }
    /** init rs and start scanning */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.device.open((error) => {
                    if (error) {
                        console.log(error.message);
                        setTimeout(() => resolve(this.init()), 1000);
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        });
    }
    /** set listeners for rs device */
    setListeners() {
        return __awaiter(this, void 0, void 0, function* () {
            this.device.on('open', () => {
                this.isScanning = true;
            });
            this.device.on('close', () => __awaiter(this, void 0, void 0, function* () {
                this.isScanning = false;
                yield this.init();
            }));
            //Create event if stop scanning
            ReaderHandler_1.ReaderHandler.getInstance().on('removed', (reader, client, type, transaction) => __awaiter(this, void 0, void 0, function* () {
                console.log('Removed listener and stop scan');
                const c = {
                    client: client, transaction: transaction || ""
                };
                this.readerService.stop(c);
            }));
            return Promise.resolve(true);
        });
    }
    /** Wrapper function that return handler function for listener */
    getCallback(client, transaction) {
        //TODO: FILTER DATA TO FIND ONLY iBEACON AND ??REMOVE DUPLICATES??
        //TODO: check is active listener.active
        return function callback(data) {
            Reader.getInstance().callback(client, data, transaction);
        };
    }
    callback(client, data, transaction) {
        console.log('clb', data.toString());
        const c = {
            transaction: transaction || "",
            client: client,
            data: data
        };
        this.productService.scanned(c).catch((e) => {
            console.log('error send event %s', e);
        }); //TODO: MORE Error handling
    }
    subscribeKafkaTopics() {
        return __awaiter(this, void 0, void 0, function* () {
            this.consumer = this._kafka.consumer({ groupId: process.env.KAFKA_GR || 'null' });
            yield this.consumer.connect();
            yield this.consumer.subscribe({ topic: 'events', fromBeginning: true });
        });
    }
    consumeKafkaMessages() {
        return this.consumer.run({
            autoCommit: false,
            eachMessage: ({ topic, partition, message }) => __awaiter(this, void 0, void 0, function* () {
                breakable: if (message.value) {
                    let value = undefined;
                    try {
                        value = JSON.parse(message.value.toString()); //TODO: TRY .. CATCG
                    }
                    catch (e) {
                        console.log("Parsing Kafka message return: %s", e.message);
                        break breakable;
                    }
                    if (value.reader_id == this.id || value.reader_id == 'ALL') {
                        switch (value.type) {
                            case build_1.EventType.READER_REQUESTED_START:
                                yield this.onStartScan(value);
                                break;
                            case build_1.EventType.READER_REQUESTED_STOP:
                                this.onStopScan(value);
                                break;
                            case build_1.EventType.READER_PRESENCE_REQUESTED:
                                console.log('READER_PRESENCE_REQUESTED');
                                this.onPresence(value);
                                break;
                        }
                    }
                    else {
                        console.log('RECEIVED KAFKA MESSAGE', 'No action for message');
                    }
                }
                //commit message
                yield this.consumer.commitOffsets([{
                        topic: topic,
                        partition: partition,
                        offset: (parseInt(message.offset, 10) + 1).toString()
                    }]);
            }),
        });
    }
    onStartScan(value) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Kafka Consumer', 'Setting listener');
            //create function for listener
            const callback = this.getCallback(value.client, value.transaction);
            //create listener
            const listener = yield ReaderHandler_1.ReaderHandler.getInstance().setValidatedListener(DeviceWrapper_1.default, 'data', callback, value.client, value.transaction, value.timeout);
            if (!listener)
                return Promise.reject('No listener created');
            //produce event
            console.log('emit event');
            const c = {
                client: value.client, transaction: value.transaction
            };
            yield this.readerService.start(c);
        });
    }
    onStopScan(value) {
        //TODO: TEST IT?
        ReaderHandler_1.ReaderHandler.getInstance().deleteListener(DeviceWrapper_1.default, value.client, 'data', value.transaction);
        //ReaderListenerHandler.getInstance().removeOldListener(Device, value.client, 'data');
    }
    onPresence(value) {
        const c = {
            client: value.client,
            transaction: value.transaction
        };
        this.readerService.present(c);
    }
}
exports.Reader = Reader;
