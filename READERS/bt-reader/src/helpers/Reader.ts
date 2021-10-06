import {Kafka} from "kafkajs";
import {ProductService} from "../events/services/ProductService";
import {ReaderService} from "../events/services/ReaderService";
import {EventStore} from "../events/stores/EventStore";
import Device from "./DeviceWrapper";
import {ReaderStateCommand} from "../events/commands/ReaderStateCommand";
import {ProductScanCommand} from "../events/commands/ProductScanCommand";
import {ReaderHandler} from "../ReaderHandler";
import {EventType} from "../../../escore/build";

require('dotenv').config()

/**
 * Reader class is a class responsible for events within a reader and events consumed by that reader.
 */
export class Reader {
    static instance: Reader; //Singleton instance
    id = process.env.ID || ""; //reader id from env variable
    type = process.env.TYPE || "";//reader type from env variable
    device: any; //device instance

    private _kafka: Kafka; //kafka instance
    consumer: any; //kafka consumer instance
    productService: ProductService; //product service instance
    readerService: ReaderService; //reader state service instance


    private kafka_host = process.env.KAFKA_HOST || "localhost:9093"; // kafka host from env variable or default
    private isScanning: boolean = false; //TODO: old version variable.


    private constructor(device: any) {
        this.device = device
        this._kafka = new Kafka({clientId: this.id, brokers: [this.kafka_host], retry: {retries: 100}});
        this.productService = new ProductService(new EventStore(this._kafka, 'products'))
        this.readerService = new ReaderService(new EventStore(this._kafka))
    }

    /** Singleton get instance */
    public static getInstance(reset?: boolean): Reader {
        if (!Reader.instance || reset) {
            Reader.instance = new Reader(Device);
        }
        return Reader.instance;
    }

    /** init bt and start scanning */
    async init(): Promise<boolean> {
        if (this.device.state === 'poweredOn') {
            return new Promise((resolve, reject) => {
                Device.startScanning([], true, (error) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(true)
                    }
                })
            })
        } else {
            return new Promise((resolve, reject) => {
                this.device.on('stateChange', (state: string) => {
                    if (state === 'poweredOn') {

                        Device.startScanning([], true, (error) => {
                            if (error) {
                                reject(error)
                            } else {

                                resolve(true)
                            }
                        })
                    } else {
                        console.log('Device try reconnect')
                        setTimeout(() => resolve(this.init()), 1000);
                    }
                })
            })
        }
    }

    /** set listeners for bt device */
    async setListeners(): Promise<boolean> {
        this.device.on('scanStart', () => {
            this.isScanning = true;
        })
        this.device.on('scanStop', async () => {
            this.isScanning = false;
            await this.init();
        })

        //Create event if stop scanning
        ReaderHandler.getInstance().on('removed', async (reader, client, type, transaction) => {
            console.log('Removed listener and stop scan')
            const c: ReaderStateCommand = {
                client: client, transaction: transaction || ""
            }
            this.readerService.stop(c)
        })


        return Promise.resolve(true)
    }

    /** Wrapper function that return handler function for listener */
    getCallback(client: any, transaction?: any): Function {
        //TODO: FILTER DATA TO FIND ONLY iBEACON AND ??REMOVE DUPLICATES??
        //TODO: check is active listener.active
        return function callback(data: any) {
            Reader.getInstance().callback(client, data,transaction)
        }
    }
    /** Function that is run on reader data callback */
    callback(client: any, data: any,transaction?: any) {
        const c: ProductScanCommand = {
            transaction: transaction || "", //TODO:
            client: client,
            data: data

        }
        this.productService.scanned(c).catch((e) => {
            console.log('error send event %s', e)
        }) //TODO: MORE Error handling

    }
    /** Function to subscribe selected kafka topic by reader */
    async subscribeKafkaTopics() {
        this.consumer = this._kafka.consumer({groupId: process.env.KAFKA_GR || 'null'})
        await this.consumer.connect()
        await this.consumer.subscribe({topic: 'events', fromBeginning: true})
    }
    /** Function to consume any message on subsribed topics */
    consumeKafkaMessages() {
        return this.consumer.run({
            autoCommit: false,
            eachMessage: async ({topic, partition, message}: any) => {
               breakable: if (message.value) {
                   let value:any = undefined
                   //parse message to obj
                    try{
                        value = JSON.parse(message.value.toString()); //TODO: TRY .. CATCG
                    }catch (e){
                        console.log("Parsing Kafka message return: %s",e.message)
                        break breakable
                    }
                   //check message and execute action
                    if (value.reader_id == this.id || value.reader_id == 'ALL') {
                        switch (value.type) {
                            case EventType.READER_REQUESTED_START:
                                await this.onStartScan(value);
                                break;

                            case EventType.READER_REQUESTED_STOP:
                                this.onStopScan(value);
                                break;
                            case EventType.READER_PRESENCE_REQUESTED:
                                console.log('READER_PRESENCE_REQUESTED')
                                this.onPresence(value);
                                break;
                        }
                    } else {
                        console.log('RECEIVED KAFKA MESSAGE', 'No action for message');

                    }
                }
                //commit message
                await this.consumer.commitOffsets([{
                    topic: topic,
                    partition: partition,
                    offset: (parseInt(message.offset, 10) + 1).toString()
                }])
            },
        })
    }
    /** Function used to start scanner */
    private async onStartScan(value: any) {
        console.log('Kafka Consumer', 'Setting listener')
        //create function for listener
        const callback: Function = this.getCallback(value.client,value.transaction);
        //create listener
        const listener = await ReaderHandler.getInstance().setValidatedListener(Device, 'discover', callback, value.client,value.transaction,value.timeout);
        if(!listener)
            return Promise.reject('No listener created')

        //produce event
        console.log('emit event')
        const c: ReaderStateCommand = {
            client: value.client, transaction: value.transaction
        }
        await this.readerService.start(c)

    }
    /** Function used to stop scanner */
    private onStopScan(value: any) {
        //TODO: TEST IT?
        ReaderHandler.getInstance().deleteListener(Device,value.client,'discover',value.transaction)
        //ReaderListenerHandler.getInstance().removeOldListener(Device, value.client, 'discover');
    }
    /** Function used to answer scanner presence */
    private onPresence(value: any) {
        const c: ReaderStateCommand = {
            client: value.client,
            transaction: value.transaction
        }
        this.readerService.present(c)
    }
}