import {IEvent} from "../../../../escore/build";

export interface UserCreatedEvent extends IEvent{
    id: string
    email: string,
    password: string,
    role: number,
    date: Date
}

