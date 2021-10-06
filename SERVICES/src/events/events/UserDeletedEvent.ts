import {IEvent} from "../../../../escore/build";

export interface UserDeletedEvent extends IEvent{
    id: string
    email: string,
    role: number,
    date: Date
}

