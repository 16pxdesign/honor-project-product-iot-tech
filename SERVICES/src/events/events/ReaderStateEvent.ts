import {IEvent} from "../../../../escore/build";

export interface Client {
    user: string,
    socket: string,
    app: string
}

export interface ReaderStateEvent extends IEvent{
    reader_id: string
    date: Date
    client?: Client
    timeout?: number
}

