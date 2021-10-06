
import dotenv from "dotenv";
import {ProductService} from "../events/services/ProductService";
import {EventStore} from "../events/stores/EventStore";
import {ProductScanCommand} from "../events/commands/ProductScanCommand";
import {Kafka} from "kafkajs";

describe('Testing kafka producer', () => {

    it('publish event', async () => {
        let service = new ProductService(new EventStore(new Kafka({clientId: 'test', brokers: ['localhost:9093'], retry: {retries: 100}})));
        const c: ProductScanCommand ={client: "x", data: "x", transaction: "x"}
        let result = await service.scanned(c);
        return Promise.resolve()
    });




})
