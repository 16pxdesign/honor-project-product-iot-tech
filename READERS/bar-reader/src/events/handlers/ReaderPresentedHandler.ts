import {EventType, ICommandHandler} from "../../../../escore/build";
import {ReaderStateCommand} from "../commands/ReaderStateCommand";
import {ReaderStateEvent} from "../events/ReaderStateEvent";

require('dotenv').config()

/**
 * Handler produce event based on command
 * Present handler create event of reader presence in system.
 */
export class ReaderPresentedHandler implements ICommandHandler<ReaderStateCommand, ReaderStateEvent> {

    async execute(command: ReaderStateCommand): Promise<ReaderStateEvent> {
        const event: ReaderStateEvent = {
            client: command.client,
            reader_id: process.env.ID || "",
            reader_type: process.env.TYPE || "",
            transaction: command.transaction,
            date: new Date(),
            type: EventType.READER_PRESENCE_RESPONDED
        }
        return event;
    }


}