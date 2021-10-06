/*
import dotenv from "dotenv";
import {ProductService} from "../events/services/ProductService";
import {EventStore} from "../events/stores/EventStore";
import {ProductScanCommand} from "../events/commands/ProductScanCommand";
import {Kafka} from "kafkajs";

describe('Delete user', () => {

    it('delete by handler', async () => {
        let service = new ProductService(new EventStore(new Kafka({clientId: 'test', brokers: ['localhost:9093'], retry: {retries: 100}})));
        const c: ProductScanCommand ={client: "x", tag_id: "x", tag_rssi: "x", tag_tx: "x", transaction: "x"}
        let result = await service.scanned(c);
        console.log(result)
        return Promise.resolve()
    });




})*/
