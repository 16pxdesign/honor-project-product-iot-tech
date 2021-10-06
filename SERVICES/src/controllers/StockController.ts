import {NextFunction, Request, Response} from "express";
import {Kafka} from "kafkajs";
import {EventType} from "../../../escore/build";
import {EventStore} from "../events/stores/EventStore";
import {StockStatusCommand} from "../events/commands/StockStatusCommand";
import {IStock, Stock} from "../models/Stock";
import {StockService} from "../events/services/StockService";


export async function stockAll(req: Request, res: Response, next: NextFunction) {

    const p: Array<IStock> = await Stock.find().exec();
    res.send(p)
}

export async function add(req: Request, res: Response, next: NextFunction) {
    const id: any = req.body.product_id;
    console.log(id, ' add stock ')
    if (id) {
        await new Stock({product_id: id}).save();
        res.send('success');
        next()
    } else {
        res.send('No id provided');
    }


}

export async function stockByID(req: Request, res: Response, next: NextFunction) {
    const p: Array<IStock> = await Stock.find({product_id: req.params.id}).exec();
    res.send(p)

}


export class StockController {

    kafka: Kafka;
    consumer: any;

    constructor(kafka: Kafka) {
        this.kafka = kafka;
    }

    async init() {
        await this.subscribeKafkaTopics()
        await this.consumeKafkaMessages()

    }

    async subscribeKafkaTopics() {
        this.consumer = this.kafka.consumer({groupId: process.env.KAFKA_GR || 'null'});
        await this.consumer.connect()
        await this.consumer.subscribe({topic: 'events', fromBeginning: true})
    }


    consumeKafkaMessages() {
        return this.consumer.run({
            autoCommit: false,
            eachMessage: async ({topic, partition, message}: any) => {
                breakable: if (message.value) {
                    let value: any = undefined
                    try {
                        //console.log(message.value.toString())
                        value = JSON.parse(message.value.toString());
                        value.offset = message.offset;

                        switch (value.type) {
                            case EventType.ORDER_PLACED:
                                await this.checkStock(value)
                                break;
                        }

                    } catch (e) {
                        console.log("Parsing Kafka message return: %s", e.message)
                        break breakable
                    }

                    //commit message
                    await this.consumer.commitOffsets([{
                        topic: topic,
                        partition: partition,
                        offset: (parseInt(message.offset, 10) + 1).toString()
                    }])
                }
            },
        })
    }

    async checkStock(transaction: any) {
        let err: string[] = []
        const products = transaction.products;
        const map = groupBy(products, (p: any) => p.product_id);
        for (let [key, value] of map) {
            const count = await Stock.count({product_id: key}).exec();
            if (value.length > count) {
                let e = 'Not enough ' + key + ' in stock: ' + count + ' of ' + value.length;
                err.push(e)
            }
        }


        // @ts-ignore
        const ids = products.map(x => x.product_id);
        console.log('my ids', ids)
        const c: StockStatusCommand = {
            products: ids,
            reason: err,
            transaction: transaction.transaction
        }
        const stockService = new StockService(new EventStore(this.kafka));
        const st = await stockService.check(c);

    }


}

function groupBy(list: any, keyGetter: any) {
    const map = new Map();
    list.forEach((item: any) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}