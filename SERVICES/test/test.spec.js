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
const kafkajs_1 = require("kafkajs");
require('dotenv');
describe('test', () => {
    it('1 test kafka await', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (() => __awaiter(void 0, void 0, void 0, function* () {
            const kafka = new kafkajs_1.Kafka({ clientId: 'test1234', brokers: ["localhost:9093"], retry: { retries: 100 } });
            const consumer = kafka.consumer({ groupId: 'group_test1234' || 'test_1234' });
            yield consumer.connect();
            console.log('connected');
            yield consumer.subscribe({ topic: 'events', fromBeginning: true });
            console.log('subscribe');
            yield consumer.run({
                autoCommit: false,
                eachMessage: ({ topic, partition, message }) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log('kafka mesege %s', message.value.toString());
                }),
            });
            console.log('consumer.run');
        }))();
    })).timeout(60000);
    it('interface', () => __awaiter(void 0, void 0, void 0, function* () {
        const p = {
            product_id: "123", product_name: "123"
        };
        console.log(p);
        return;
    }));
});
