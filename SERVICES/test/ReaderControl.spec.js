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
const EventStore_1 = require("../src/events/stores/EventStore");
const build_1 = require("../../escore/build");
const chai_1 = require("chai");
const ReaderStartScanHandler_1 = require("../src/events/handlers/ReaderStartScanHandler");
const ReaderService_1 = require("../src/events/services/ReaderService");
const kafkajs_1 = require("kafkajs");
require('dotenv');
describe('Reader test', () => {
    it('command by handler', () => __awaiter(void 0, void 0, void 0, function* () {
        const handler = new ReaderStartScanHandler_1.ReaderStartScanHandler();
        const c = {
            reader_id: "reader_id",
            transaction: 'transaction'
        };
        const event = yield handler.execute(c);
        console.log(event);
        chai_1.expect(event.type).to.equal(build_1.EventType.READER_REQUESTED_START);
        return;
    }));
    it('command by service', () => __awaiter(void 0, void 0, void 0, function* () {
        const c = {
            reader_id: "BT_1",
            transaction: 'transaction',
            timeout: 100000
        };
        const kafka = new kafkajs_1.Kafka({ clientId: 'test', brokers: ["localhost:9093"], retry: { retries: 100 } });
        const eventStore = new EventStore_1.EventStore(kafka);
        const readerService = new ReaderService_1.ReaderService(eventStore);
        yield readerService.start(c);
        return;
    }));
    it('command stop by service', () => __awaiter(void 0, void 0, void 0, function* () {
        const c = {
            reader_id: "BT_1",
            transaction: 'transaction',
        };
        const kafka = new kafkajs_1.Kafka({ clientId: 'test', brokers: ["localhost:9093"], retry: { retries: 100 } });
        const eventStore = new EventStore_1.EventStore(kafka);
        const readerService = new ReaderService_1.ReaderService(eventStore);
        yield readerService.stop(c);
        return;
    }));
    it('test start reader controller', () => __awaiter(void 0, void 0, void 0, function* () {
        //  await startReader('user_id')
        return;
    }));
});
