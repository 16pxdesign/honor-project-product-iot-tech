import {IEvent} from "../events/IEvent";

/**
 * Generic interface to interact with database and perform publication of event to broker
 * or to any event storage storage like database
 */
export interface IStore {
    publish(event: IEvent): Promise<boolean>;
}