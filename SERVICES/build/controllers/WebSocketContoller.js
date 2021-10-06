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
exports.Emitter = exports.stopReader = exports.startReader = exports.socketHandler = void 0;
const EventStore_1 = require("../events/stores/EventStore");
const ReaderService_1 = require("../events/services/ReaderService");
const events_1 = __importDefault(require("events"));
const build_1 = require("../../../escore/build");
const server_1 = require("../server");
const uuid = require('node-uuid');
function socketHandler(socket, emitter) {
    const array = [];
    const user_id = socket.handshake.session.passport.user;
    //var cc= socket.handshake.headers.cookie || socket.request.headers.cookie || ''
    console.log('socket is:', socket.id);
    socket.emit('started', 'xd');
    console.log('emited io');
    // @ts-ignore
    console.log('io on connect - passport.user: ', socket.handshake.session.passport.user);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    //TODO Create just one instance as it will make multiple emitters.
    socket.on('start_reader', (data, timeout) => __awaiter(this, void 0, void 0, function* () {
        const callbackRef = (data) => { callback(data, socket); };
        const eventEmitter = emitter.addListener('product', callbackRef);
        console.log("eventEmitter", callbackRef);
        const transaction_id = yield startReader(user_id, data, timeout);
        array.push({ transaction: transaction_id, listener: callbackRef });
        socket.emit('reader_started', transaction_id);
    }));
    socket.on('stop_reader', (transaction) => __awaiter(this, void 0, void 0, function* () {
        yield stopReader(transaction);
        console.log('stop on web request');
        //TODO: REMOVE LISTENER?
    }));
    emitter.on('event_stoped', (transaction, id) => {
        socket.emit('reader_stopped', transaction, id);
        console.log(array);
        array.forEach((item, index, object) => {
            if (item.transaction == transaction) {
                emitter.removeListener('product', item.listener);
                object.splice(index, 1);
            }
        });
        console.log(array);
    });
}
exports.socketHandler = socketHandler;
function callback(data, socket) {
    if (socket.handshake.session.passport.user == data.client.user) {
        // console.log('callback data to web')
        socket.emit('scanned', data);
    }
}
function startReader(user, reader, timeout) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = {
            app: "", socket: "", user: user
        };
        console.log('timeout from websocket', timeout);
        const c = {
            reader_id: reader,
            client: client,
            transaction: uuid.v4(),
            timeout: timeout == undefined ? 10000 : timeout
        };
        const eventStore = new EventStore_1.EventStore(server_1.kafka);
        const readerService = new ReaderService_1.ReaderService(eventStore);
        yield readerService.start(c);
        return c.transaction;
    });
}
exports.startReader = startReader;
function stopReader(transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const c = {
            reader_id: "ALL", transaction: transaction
        };
        const eventStore = new EventStore_1.EventStore(server_1.kafka);
        const readerService = new ReaderService_1.ReaderService(eventStore);
        yield readerService.stop(c);
    });
}
exports.stopReader = stopReader;
class Emitter extends events_1.default {
    constructor(kafka) {
        super();
        this._kafka = kafka;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.subscribeKafkaTopics();
            yield this.consumeKafkaMessages();
        });
    }
    subscribeKafkaTopics() {
        return __awaiter(this, void 0, void 0, function* () {
            this.consumer = this._kafka.consumer({ groupId: process.env.KAFKA_GR || 'nonGroup' });
            yield this.consumer.connect();
            yield this.consumer.subscribe({ topic: 'products' });
            yield this.consumer.subscribe({ topic: 'events' });
        });
    }
    consumeKafkaMessages() {
        return this.consumer.run({
            autoCommit: false,
            eachMessage: ({ topic, partition, message }) => __awaiter(this, void 0, void 0, function* () {
                breakable: if (message.value) {
                    let value = undefined;
                    try {
                        console.log(message.value.toString());
                        value = JSON.parse(message.value.toString());
                        value.offset = message.offset;
                        //console.log('kafka massage in json is ', value)
                        switch (topic) {
                            case 'products':
                                //  console.log('incomming product')
                                this.emit('product', value);
                                break;
                            case 'events':
                                //    console.log('incomming event')
                                if (value.type == build_1.EventType.READER_STOPED)
                                    if (value.transaction)
                                        this.emit('event_stoped', value.transaction, value.reader_id);
                                break;
                        }
                    }
                    catch (e) {
                        console.log("Parsing Kafka message return: %s", e.message);
                        break breakable;
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
}
exports.Emitter = Emitter;
