import {Kafka} from "kafkajs";
import {EventStore} from "../events/stores/EventStore";
import {ReaderService} from "../events/services/ReaderService";
import {ReaderStateCommand} from "../events/commands/ReaderStateCommand";
import {Client} from "../events/events/ReaderStateEvent";
import EventEmitter from "events";
import {EventType} from "../../../escore/build";
import {kafka} from "../server"

const uuid = require('node-uuid');


export function socketHandler(socket: any, emitter: EventEmitter) {
    const array: { transaction: any, listener: any }[] = [];

    const user_id = socket.handshake.session.passport.user
    //var cc= socket.handshake.headers.cookie || socket.request.headers.cookie || ''
    console.log('socket is:', socket.id)
    socket.emit('started', 'xd')
    console.log('emited io')
    // @ts-ignore
    console.log('io on connect - passport.user: ', socket.handshake.session.passport.user)

    socket.on('disconnect', () => {
        console.log('Client disconnected')
    })

    //TODO Create just one instance as it will make multiple emitters.

    socket.on('start_reader', async (data: string, timeout?: number) => {

        const callbackRef = (data: any) => {
            callback(data, socket)
        };
        const eventEmitter = emitter.addListener('product', callbackRef);
        console.log("eventEmitter", callbackRef)

        const transaction_id = await startReader(user_id, data, timeout);
        array.push({transaction: transaction_id, listener: callbackRef})
        socket.emit('reader_started', transaction_id)


    })

    socket.on('stop_reader', async (transaction: string) => {
        await stopReader(transaction);
        console.log('stop on web request')
        //TODO: REMOVE LISTENER?
    })

    emitter.on('event_stoped', (transaction, id) => {
        socket.emit('reader_stopped', transaction, id)

        console.log(array)
        array.forEach((item, index, object) => {
            if (item.transaction == transaction) {
                emitter.removeListener('product', item.listener)
                object.splice(index, 1);
            }
        })
        console.log(array)
    })

}

function callback(data: any, socket: any) {
    if (socket.handshake.session.passport.user == data.client.user) {
        // console.log('callback data to web')
        socket.emit('scanned', data)
    }

}


export async function startReader(user: any, reader: string, timeout?: number) {
    const client: Client = {
        app: "", socket: "", user: user

    }
    console.log('timeout from websocket', timeout)
    const c: ReaderStateCommand = {
        reader_id: reader,
        client: client,
        transaction: uuid.v4(),
        timeout: timeout == undefined ? 10_000 : timeout
    }
    const eventStore = new EventStore(kafka);
    const readerService = new ReaderService(eventStore);
    await readerService.start(c);
    return c.transaction;
}

export async function stopReader(transaction: string) {
    const c: ReaderStateCommand = {
        reader_id: "ALL", transaction: transaction
    }
    const eventStore = new EventStore(kafka);
    const readerService = new ReaderService(eventStore);
    await readerService.stop(c);
}

export class Emitter extends EventEmitter {

    _kafka: Kafka;
    consumer: any;


    constructor(kafka: Kafka) {
        super();
        this._kafka = kafka;
    }

    async init() {
        await this.subscribeKafkaTopics()
        await this.consumeKafkaMessages()
    }

    async subscribeKafkaTopics() {
        this.consumer = this._kafka.consumer({groupId: process.env.KAFKA_GR || 'nonGroup'})
        await this.consumer.connect()
        await this.consumer.subscribe({topic: 'products'})
        await this.consumer.subscribe({topic: 'events'})
    }

    consumeKafkaMessages() {
        return this.consumer.run({
            autoCommit: false,
            eachMessage: async ({topic, partition, message}: any) => {
                breakable: if (message.value) {
                    let value: any = undefined
                    try {
                        console.log(message.value.toString())
                        value = JSON.parse(message.value.toString());
                        value.offset = message.offset;
                        //console.log('kafka massage in json is ', value)
                        switch (topic) {
                            case 'products':
                                //  console.log('incomming product')
                                this.emit('product', value)
                                break
                            case 'events':
                                //    console.log('incomming event')
                                if (value.type == EventType.READER_STOPED)
                                    if (value.transaction)

                                        this.emit('event_stoped', value.transaction, value.reader_id)
                                break
                        }

                    } catch (e) {
                        console.log("Parsing Kafka message return: %s", e.message)
                        break breakable
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
}