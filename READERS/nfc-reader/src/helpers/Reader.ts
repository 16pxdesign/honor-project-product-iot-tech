import {Kafka} from "kafkajs";
import {ProductService} from "../events/services/ProductService";
import {ReaderService} from "../events/services/ReaderService";
import {EventStore} from "../events/stores/EventStore";
import nfc from "./DeviceWrapper";
import {ReaderStateCommand} from "../events/commands/ReaderStateCommand";
import {ProductScanCommand} from "../events/commands/ProductScanCommand";
import {ReaderHandler} from "../ReaderHandler";
import {EventType} from "../../../escore/build";

require('dotenv').config()

const Device = new nfc()

export class Reader {
    static instance: Reader; //Singleton instance
    id = process.env.ID || "";
    type = process.env.TYPE || "";
    device: any;

    private _kafka: Kafka;
    consumer: any; //kafka consumer
    productService: ProductService;
    readerService: ReaderService;


    private kafka_host;
    private isScanning: boolean = false; //redundant?


    private constructor(device: any) {
        if(!process.env.KAFKA_HOST) console.log('Localhost mode due no env for kafka')
        this.kafka_host = process.env.KAFKA_HOST || "localhost:9093"
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

    /** init rs and start scanning */
    async init(): Promise<boolean> {
        return new Promise( (resolve, reject) =>{
            this.device.open((error:any) => {
                if (error) {
                    console.log(error.message)
                    setTimeout(() => resolve(this.init()), 1000);
                } else {
                    resolve(true)
                }
            })
        });
    }

    /** set listeners for rs device */
    async setListeners(): Promise<boolean> {
        this.device.on('open', () => {
            this.isScanning = true;
        })
        this.device.on('close', async () => {
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

    callback(client: any, data: any,transaction?: any) {
        console.log('clb', data.toString())
        const c: ProductScanCommand = {
            transaction: transaction || "",
            client: client,
            data: data

        }
        this.productService.scanned(c).catch((e) => {
            console.log('error send event %s', e)
        }) //TODO: MORE Error handling

    }

    async subscribeKafkaTopics() {
        console.log("subscribeKafkaTopics")
        this.consumer = this._kafka.consumer({groupId: process.env.KAFKA_GR || 'null'})
        await this.consumer.connect()
        await this.consumer.subscribe({topic: 'events', fromBeginning: true})
    }

    consumeKafkaMessages() {
        return this.consumer.run({
            autoCommit: false,
            eachMessage: async ({topic, partition, message}: any) => {
               breakable: if (message.value) {
                   let value:any = undefined
                    try{
                        value = JSON.parse(message.value.toString()); //TODO: TRY .. CATCG
                    }catch (e){
                        console.log("Parsing Kafka message return: %s",e.message)
                        break breakable
                    }
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

    private async onStartScan(value: any) {
        console.log('Kafka Consumer', 'Setting listener')
        //create function for listener
        const callback: Function = this.getCallback(value.client,value.transaction);
        //create listener
        const listener = await ReaderHandler.getInstance().setValidatedListener(Device, 'data', callback, value.client,value.transaction,value.timeout);
        if(!listener)
            return Promise.reject('No listener created')

        //produce event
        console.log('emit event')
        const c: ReaderStateCommand = {
            client: value.client, transaction: value.transaction
        }
        await this.readerService.start(c)

    }

    private onStopScan(value: any) {
        //TODO: TEST IT?
        ReaderHandler.getInstance().deleteListener(Device,value.client,'data',value.transaction)
        //ReaderListenerHandler.getInstance().removeOldListener(Device, value.client, 'data');
    }

    private onPresence(value: any) {
        const c: ReaderStateCommand = {
            client: value.client,
            transaction: value.transaction
        }
        this.readerService.present(c)
    }
}