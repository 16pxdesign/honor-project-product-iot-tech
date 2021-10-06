import {UserCreateCommand} from "../commands/UserCreateCommand";
import {UserCreatedEvent} from "../events/UserCreatedEvent";
import {EventType} from "../../../../escore/build";
import { ICommandHandler } from "../../../../escore/build";
import * as mongoose from "mongoose";

const uuid = require("node-uuid");
const bson = require('bson');


export class UserCreateHandler implements ICommandHandler<UserCreateCommand, UserCreatedEvent> {

    async execute(command: UserCreateCommand): Promise<UserCreatedEvent> {
        const event: UserCreatedEvent = {
            id: new bson.ObjectId(),
            date: new Date(),
            email: command.email,
            password: command.password,
            role: command.role,
            type: EventType.USER_CREATED,
            transaction: uuid.v4()
        }
        return event;
    }

}