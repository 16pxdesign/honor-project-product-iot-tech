import {IEvent, IStore} from "../../../../escore/build";
import {Kafka} from "kafkajs";

/**
 * Event store is responsible for the communication layer with the selected store.
 * This class is responsible for communication with kafka.
 */
export class EventStore implements IStore {

    kafka: Kafka // kafka instance
    topic: string = 'events'; //kafka topic to publish events

    constructor(kafka: Kafka, topic?: string) {
        this.kafka = kafka;
        if (topic)
            this.topic = topic;
    }

    /** Kafka: This approach is faster to implement and resolves Promise response time
     * so it's a good idea not to await on aknolage and believe is sent.
     * Can be replaced by a dispatcher that looks in the interval loop for events and sends them to the kafka log */
    async publish(event: IEvent): Promise<boolean> {
        //producer instance and connect
        const producer = this.kafka.producer();
        await producer.connect();
        //send message to selected topic
        await producer.send({
            topic: this.topic,
            messages: [
                {value: JSON.stringify(event)},
            ],
        })
        //disconnect
        await producer.disconnect();
        return true
    }

}
