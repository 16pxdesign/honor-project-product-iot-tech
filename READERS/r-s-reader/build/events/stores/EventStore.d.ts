import { IEvent, IStore } from "../../../../escore/build";
import { Kafka } from "kafkajs";
export declare class EventStore implements IStore {
    kafka: Kafka;
    topic: string;
    constructor(kafka: Kafka, topic?: string);
    /** Kafka: This approach is faster in implement however solves Promise response time
     * so good idea is not await on aknolage and believe is sent
     * Can be replaced by dispatcher that look in interval loop for events and push them do kafka log */
    publish(event: IEvent): Promise<boolean>;
}
