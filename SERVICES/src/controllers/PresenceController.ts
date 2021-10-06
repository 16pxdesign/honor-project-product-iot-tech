import {Kafka} from "kafkajs";
import {EventType} from "../../../escore/build";
import {ReaderStateCommand} from "../events/commands/ReaderStateCommand";
import {EventStore} from "../events/stores/EventStore";
import {ReaderService} from "../events/services/ReaderService";
import Reader from "../models/Readers";
import {NextFunction, Request, Response} from "express";

/** Return all readers in database */
export async function listAllReaders(req: Request, res: Response, next: NextFunction) {
    const readerDocuments = await Reader.find({}).exec();
    return res.send(readerDocuments)
}

/** Change Reader status to value */
export async function changeState(req: Request, res: Response, next: NextFunction) {
    console.log(req.body)
    //TODO: EVENT
    await Reader.findOneAndUpdate({_id: req.body.id}, {active: req.body.active}).exec();
    return res.send("success")
}

/** Return active readers no older then x minutes */
export async function listActiveReaders(req: Request, res: Response, next: NextFunction) {
    let date1 = new Date();
    date1 = new Date(date1.getTime() - 1000 * 60 * 2)
    const date2 = new Date();
    const readerDocuments = await Reader.find({active: true, date: {$gt: date1, $lt: date2}}).exec();
    return res.send(readerDocuments)
}

export class PresenceController {
    kafka: Kafka;
    consumer: any;

    constructor(kafka: Kafka) {
        this.kafka = kafka;
    }

    async init() {
        await this.subscribeKafkaTopics()
        await this.consumeKafkaMessages()

        setInterval(async () => {
            console.log("Running presence service");
            console.log("--------------------------");
            try {
                await this.presence();
            } catch (e) {
                console.log(e.message)
            }
        }, 60_000)

    }

    async subscribeKafkaTopics() {
        this.consumer = this.kafka.consumer({groupId: process.env.KAFKA_GR || 'presence'});
        await this.consumer.connect()
        await this.consumer.subscribe({topic: 'events'})
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
                            case EventType.READER_PRESENCE_RESPONDED:
                                console.log('=====================', value)

                                if (value.reader_id) {
                                    console.log('ask mongo ------------------------')
                                    const exist = await Reader.exists({reader_id: value.reader_id});
                                    if (exist) {
                                        await Reader.findOneAndUpdate({reader_id: value.reader_id}, {date: value.date})
                                    } else {
                                        await new Reader({reader_id: value.reader_id, date: value.date}).save()
                                    }
                                    //const reader = await Reader.findOne((x:any)=>x.reader_id == 'x').exec();
                                    //console.log('reader is', reader)
                                }

                                break;
                        }

                    } catch (e) {
                        console.log("Parsing Kafka message return: %s", e.message)
                        break breakable
                    }
                }

                //commit message
                await this.consumer.commitOffsets([{
                    topic: topic,
                    partition: partition,
                    offset: (parseInt(message.offset, 10) + 1).toString()
                }])
            },
        })
    }

    async presence() {
        const c: ReaderStateCommand = {
            reader_id: "ALL", transaction: ""
        }
        const eventStore = new EventStore(this.kafka);
        const readerService = new ReaderService(eventStore);
        await readerService.present(c);
    }

}

