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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = exports.transactionByID = exports.transactions = exports.transactionsAll = void 0;
const Transaction_1 = require("../models/Transaction");
const build_1 = require("../../../escore/build");
function transactionsAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const p = yield Transaction_1.Transaction.find().populate('products').exec();
        res.send(p);
    });
}
exports.transactionsAll = transactionsAll;
function transactions(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const id = req.user._id;
        const p = yield Transaction_1.Transaction.find({ user_id: id }).exec();
        res.send(p);
    });
}
exports.transactions = transactions;
function transactionByID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const p = yield Transaction_1.Transaction.find({ transaction_id: req.params.id }).populate('products').exec();
        //TODO: ATTACH PRODUCT INFORAMTIONS?
        res.send(p);
    });
}
exports.transactionByID = transactionByID;
class OrderController {
    constructor(kafka) {
        this.kafka = kafka;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.subscribeKafkaTopics();
            yield this.consumeKafkaMessages();
        });
    }
    subscribeKafkaTopics() {
        return __awaiter(this, void 0, void 0, function* () {
            this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_GR || 'orders' });
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
                        //console.log(message.value.toString())
                        value = JSON.parse(message.value.toString());
                        value.offset = message.offset;
                        console.log('Kafka message', value.type);
                        switch (value.type) {
                            case build_1.EventType.ORDER_APPROVED:
                                console.log('ORDER_APPROVED');
                                yield Transaction_1.Transaction.findOneAndUpdate({ transaction_id: value.transaction }, { approved: true, reason: value.reason }).exec();
                                break;
                            case build_1.EventType.ORDER_REJECTED:
                                console.log('ORDER_REJECTED');
                                yield Transaction_1.Transaction.findOneAndUpdate({ transaction_id: value.transaction }, { approved: false, reason: value.reason }).exec();
                                break;
                        }
                    }
                    catch (e) {
                        console.log("Parsing Kafka message return: %s", e.message);
                        break breakable;
                    }
                    //commit message
                    yield this.consumer.commitOffsets([{
                            topic: topic,
                            partition: partition,
                            offset: (parseInt(message.offset, 10) + 1).toString()
                        }]);
                }
            }),
        });
    }
}
exports.OrderController = OrderController;
