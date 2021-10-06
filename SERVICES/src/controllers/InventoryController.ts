import {NextFunction, Request, Response} from "express";
import {IInventory, Inventory} from "../models/Inventory";
import {Kafka} from "kafkajs";
import {ReaderStateCommand} from "../events/commands/ReaderStateCommand";
import {EventStore} from "../events/stores/EventStore";
import {ReaderService} from "../events/services/ReaderService";
import {EventType} from "../../../escore/build";
import {Client} from "../events/events/ReaderStateEvent";


export async function inventoryList(req: Request, res: Response, next: NextFunction) {
    const minutes = Number(req.params.time) || 1
    let date1 = new Date();
    date1 = new Date(date1.getTime() - 1000 * 60 * minutes)
    const date2 = new Date();
    const p: Array<IInventory> = await Inventory.find({date: {$gt: date1, $lt: date2}}).exec();
    res.send(p)
}

export async function find(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    console.log(id)
    const p: Array<IInventory> = await Inventory.find({product_id: id}).exec();
    console.log(p)
    res.send(p)
}


export class InventoryController {
    kafka: Kafka;
    consumer: any;
    refresh_time: any = process.env.REFRESH || 45_000
    timeout_time: any = process.env.TIMEOUT || 30_000

    constructor(kafka: Kafka) {
        this.kafka = kafka;
    }

    async init() {
        await this.subscribeKafkaTopics()
        await this.consumeKafkaMessages()

        setInterval(async () => {
            console.log("Running inventory service");
            console.log("--------------------------");
            try {
                await this.scan();
            } catch (e) {
                console.log(e.message)
            }
        }, this.refresh_time)

    }

    async subscribeKafkaTopics() {
        this.consumer = this.kafka.consumer({groupId: process.env.KAFKA_GR || 'inv'});
        await this.consumer.connect()
        await this.consumer.subscribe({topic: 'products'})
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
                            case EventType.PRODUCT_SCANNED:
                                /** uniqure BT or RFID products */
                                if (value.reader_type == 'BARCODE') {
                                    await new Inventory({
                                        product_id: value.product_id,
                                        date: value.date,
                                        reader_id: value.reader_id
                                    }).save()
                                } else {
                                    if (value.product_id) {
                                        const exist = await Inventory.exists({product_id: value.product_id});
                                        if (exist) {
                                            await Inventory.findOneAndUpdate({product_id: value.product_id}, {
                                                date: value.date,
                                                reader_id: value.reader_id
                                            })
                                        } else {
                                            await new Inventory({
                                                product_id: value.product_id,
                                                date: value.date,
                                                reader_id: value.reader_id
                                            }).save()
                                        }
                                    }
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

    async scan() {
        const cli: Client = {
            app: "inventory", socket: "", user: "inventory"

        }
        const c: ReaderStateCommand = {
            reader_id: 'ALL',
            client: cli,
            transaction: 'scan',
            timeout: this.timeout_time
        }
        const eventStore = new EventStore(this.kafka);
        const readerService = new ReaderService(eventStore);
        await readerService.start(c);
    }

}




