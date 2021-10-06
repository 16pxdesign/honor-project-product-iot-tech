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
exports.StockController = exports.stockByID = exports.add = exports.stockAll = void 0;
const build_1 = require("../../../escore/build");
const EventStore_1 = require("../events/stores/EventStore");
const Stock_1 = require("../models/Stock");
const StockService_1 = require("../events/services/StockService");
function stockAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const p = yield Stock_1.Stock.find().exec();
        res.send(p);
    });
}
exports.stockAll = stockAll;
function add(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.product_id;
        console.log(id, ' add stock ');
        if (id) {
            yield new Stock_1.Stock({ product_id: id }).save();
            res.send('success');
            next();
        }
        else {
            res.send('No id provided');
        }
    });
}
exports.add = add;
function stockByID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const p = yield Stock_1.Stock.find({ product_id: req.params.id }).exec();
        res.send(p);
    });
}
exports.stockByID = stockByID;
class StockController {
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
            this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_GR || 'null' });
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
                        switch (value.type) {
                            case build_1.EventType.ORDER_PLACED:
                                yield this.checkStock(value);
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
    checkStock(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let err = [];
            const products = transaction.products;
            const map = groupBy(products, (p) => p.product_id);
            for (let [key, value] of map) {
                const count = yield Stock_1.Stock.count({ product_id: key }).exec();
                if (value.length > count) {
                    let e = 'Not enough ' + key + ' in stock: ' + count + ' of ' + value.length;
                    err.push(e);
                }
            }
            // @ts-ignore
            const ids = products.map(x => x.product_id);
            console.log('my ids', ids);
            const c = {
                products: ids,
                reason: err,
                transaction: transaction.transaction
            };
            const stockService = new StockService_1.StockService(new EventStore_1.EventStore(this.kafka));
            const st = yield stockService.check(c);
        });
    }
}
exports.StockController = StockController;
function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        }
        else {
            collection.push(item);
        }
    });
    return map;
}
