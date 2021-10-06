import {IEvent, IStore} from "../../../../escore/build";
import {Kafka} from "kafkajs";

export class EventStore implements IStore {

    kafka: Kafka
    topic: string = 'events';

    constructor(kafka: Kafka, topic?: string) {
        this.kafka = kafka;
        if (topic)
            this.topic = topic;
    }


    /** Kafka: This approach is faster in implement however solves Promise response time
     * so good idea is not await on aknolage and believe is sent
     * Can be replaced by dispatcher that look in interval loop for events and push them do kafka log */
    async publish(event: IEvent): Promise<boolean> {

        console.log('Publish event %s to',this.topic)
        const producer = this.kafka.producer();
        await producer.connect();
        await producer.send({
            topic: this.topic,
            messages: [
                {value: JSON.stringify(event)},
            ],
        })
        await producer.disconnect();


        return true
    }

}
