import {IEvent} from "../../../../escore/build";

/**
 * The interface determines the structure of emitted event
 * Event dedicated to presents changed reader state.
 */
export interface ReaderStateEvent extends IEvent{
    reader_id: string //Reader client id
    reader_type: string //Reader client type
    client: string //Requested client
    date: Date //Time of change
}

