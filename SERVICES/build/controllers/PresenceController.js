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
exports.PresenceController = exports.listActiveReaders = exports.changeState = exports.listAllReaders = void 0;
const build_1 = require("../../../escore/build");
const EventStore_1 = require("../events/stores/EventStore");
const ReaderService_1 = require("../events/services/ReaderService");
const Readers_1 = __importDefault(require("../models/Readers"));
/** Return all readers in database */
function listAllReaders(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const readerDocuments = yield Readers_1.default.find({}).exec();
        return res.send(readerDocuments);
    });
}
exports.listAllReaders = listAllReaders;
/** Change Reader status to value */
function changeState(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        //TODO: EVENT
        yield Readers_1.default.findOneAndUpdate({ _id: req.body.id }, { active: req.body.active }).exec();
        return res.send("success");
    });
}
exports.changeState = changeState;
/** Return active readers no older then x minutes */
function listActiveReaders(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let date1 = new Date();
        date1 = new Date(date1.getTime() - 1000 * 60 * 2);
        const date2 = new Date();
        const readerDocuments = yield Readers_1.default.find({ active: true, date: { $gt: date1, $lt: date2 } }).exec();
        return res.send(readerDocuments);
    });
}
exports.listActiveReaders = listActiveReaders;
class PresenceController {
    constructor(kafka) {
        this.kafka = kafka;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.subscribeKafkaTopics();
            yield this.consumeKafkaMessages();
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                console.log("Running presence service");
                console.log("--------------------------");
                try {
                    yield this.presence();
                }
                catch (e) {
                    console.log(e.message);
                }
            }), 60000);
        });
    }
    subscribeKafkaTopics() {
        return __awaiter(this, void 0, void 0, function* () {
            this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_GR || 'presence' });
            yield this.consumer.connect();
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
                        //console.log(message.value.toString())
                        value = JSON.parse(message.value.toString());
                        value.offset = message.offset;
                        switch (value.type) {
                            case build_1.EventType.READER_PRESENCE_RESPONDED:
                                console.log('=====================', value);
                                if (value.reader_id) {
                                    console.log('ask mongo ------------------------');
                                    const exist = yield Readers_1.default.exists({ reader_id: value.reader_id });
                                    if (exist) {
                                        yield Readers_1.default.findOneAndUpdate({ reader_id: value.reader_id }, { date: value.date });
                                    }
                                    else {
                                        yield new Readers_1.default({ reader_id: value.reader_id, date: value.date }).save();
                                    }
                                    //const reader = await Reader.findOne((x:any)=>x.reader_id == 'x').exec();
                                    //console.log('reader is', reader)
                                }
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
    presence() {
        return __awaiter(this, void 0, void 0, function* () {
            const c = {
                reader_id: "ALL", transaction: ""
            };
            const eventStore = new EventStore_1.EventStore(this.kafka);
            const readerService = new ReaderService_1.ReaderService(eventStore);
            yield readerService.present(c);
        });
    }
}
exports.PresenceController = PresenceController;
