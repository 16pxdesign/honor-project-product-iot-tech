import {EventStore} from "../src/events/stores/EventStore";
import {EventType} from '../../escore/build';
import {expect} from 'chai';
import {ReaderStartScanHandler} from "../src/events/handlers/ReaderStartScanHandler";
import {ReaderStateCommand} from "../src/events/commands/ReaderStateCommand";
import {ReaderService} from "../src/events/services/ReaderService";
import {Kafka} from "kafkajs";

require('dotenv')


describe('Reader test', () => {

    it('command by handler', async () => {
        const handler = new ReaderStartScanHandler();
        const c: ReaderStateCommand = {
            reader_id: "reader_id",
            transaction: 'transaction'
        }
        const event = await handler.execute(c);
        console.log(event)
        expect(event.type).to.equal(EventType.READER_REQUESTED_START)
        return
    });

    it('command by service', async () => {
        const c: ReaderStateCommand = {
            reader_id: "BT_1",
            transaction: 'transaction',
            timeout: 100000
        }
        const kafka = new Kafka({clientId: 'test', brokers: ["localhost:9093"], retry: {retries: 100}});
        const eventStore = new EventStore(kafka);
        const readerService = new ReaderService(eventStore);

        return
    });

    it('command stop by service', async () => {
        const c: ReaderStateCommand = {
            reader_id: "BT_1",
            transaction: 'transaction',
        }
        const kafka = new Kafka({clientId: 'test', brokers: ["localhost:9093"], retry: {retries: 100}});
        const eventStore = new EventStore(kafka);
        const readerService = new ReaderService(eventStore);
        await readerService.stop(c);

        return
    });

    it('test start reader controller', async () => {
        //  await startReader('user_id')
        return
    })

})