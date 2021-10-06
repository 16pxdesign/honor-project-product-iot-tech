import {NextFunction, Request, Response} from "express";
import {ITransactionDocument, Transaction} from "../models/Transaction";
import {Kafka} from "kafkajs";
import {EventType} from "../../../escore/build";


export async function transactionsAll(req: Request, res: Response, next: NextFunction) {

    const p: Array<ITransactionDocument> = await Transaction.find().populate('products').exec();
    res.send(p)
}

export async function transactions(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    const id = req.user._id;
    const p: Array<ITransactionDocument> = await Transaction.find({user_id: id}).exec();
    res.send(p);
}

export async function transactionByID(req: Request, res: Response, next: NextFunction) {
    const p: Array<ITransactionDocument> = await Transaction.find({transaction_id: req.params.id}).populate('products').exec();
    //TODO: ATTACH PRODUCT INFORAMTIONS?
    res.send(p)

}

export class OrderController {

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
        this.consumer = this.kafka.consumer({groupId: process.env.KAFKA_GR || 'orders'});
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
                        console.log('Kafka message', value.type)
                        switch (value.type) {
                            case EventType.ORDER_APPROVED:
                                console.log('ORDER_APPROVED')
                                await Transaction.findOneAndUpdate({transaction_id: value.transaction}, {
                                    approved: true,
                                    reason: value.reason
                                }).exec()
                                break;
                            case EventType.ORDER_REJECTED:
                                console.log('ORDER_REJECTED')
                                await Transaction.findOneAndUpdate({transaction_id: value.transaction}, {
                                    approved: false,
                                    reason: value.reason
                                }).exec()
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


}