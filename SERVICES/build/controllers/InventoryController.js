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
exports.InventoryController = exports.find = exports.inventoryList = void 0;
const Inventory_1 = require("../models/Inventory");
const EventStore_1 = require("../events/stores/EventStore");
const ReaderService_1 = require("../events/services/ReaderService");
const build_1 = require("../../../escore/build");
function inventoryList(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const minutes = Number(req.params.time) || 1;
        let date1 = new Date();
        date1 = new Date(date1.getTime() - 1000 * 60 * minutes);
        const date2 = new Date();
        const p = yield Inventory_1.Inventory.find({ date: { $gt: date1, $lt: date2 } }).exec();
        res.send(p);
    });
}
exports.inventoryList = inventoryList;
function find(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        console.log(id);
        const p = yield Inventory_1.Inventory.find({ product_id: id }).exec();
        console.log(p);
        res.send(p);
    });
}
exports.find = find;
class InventoryController {
    constructor(kafka) {
        this.refresh_time = process.env.REFRESH || 45000;
        this.timeout_time = process.env.TIMEOUT || 30000;
        this.kafka = kafka;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.subscribeKafkaTopics();
            yield this.consumeKafkaMessages();
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                console.log("Running inventory service");
                console.log("--------------------------");
                try {
                    yield this.scan();
                }
                catch (e) {
                    console.log(e.message);
                }
            }), this.refresh_time);
        });
    }
    subscribeKafkaTopics() {
        return __awaiter(this, void 0, void 0, function* () {
            this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_GR || 'inv' });
            yield this.consumer.connect();
            yield this.consumer.subscribe({ topic: 'products' });
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
                            case build_1.EventType.PRODUCT_SCANNED:
                                /** uniqure BT or RFID products */
                                if (value.reader_type == 'BARCODE') {
                                    yield new Inventory_1.Inventory({ product_id: value.product_id, date: value.date, reader_id: value.reader_id }).save();
                                }
                                else {
                                    if (value.product_id) {
                                        const exist = yield Inventory_1.Inventory.exists({ product_id: value.product_id });
                                        if (exist) {
                                            yield Inventory_1.Inventory.findOneAndUpdate({ product_id: value.product_id }, { date: value.date, reader_id: value.reader_id });
                                        }
                                        else {
                                            yield new Inventory_1.Inventory({ product_id: value.product_id, date: value.date, reader_id: value.reader_id }).save();
                                        }
                                    }
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
    scan() {
        return __awaiter(this, void 0, void 0, function* () {
            const cli = {
                app: "inventory", socket: "", user: "inventory"
            };
            const c = {
                reader_id: 'ALL',
                client: cli,
                transaction: 'scan',
                timeout: this.timeout_time
            };
            const eventStore = new EventStore_1.EventStore(this.kafka);
            const readerService = new ReaderService_1.ReaderService(eventStore);
            yield readerService.start(c);
        });
    }
}
exports.InventoryController = InventoryController;
