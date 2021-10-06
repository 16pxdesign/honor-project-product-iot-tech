import {IEvent} from "../../../../escore/build";

export interface ReaderStateEvent extends IEvent{
    reader_id: string
    reader_type: string
    client: string
    date: Date
}

