import {EventType, ICommandHandler } from "../../../../escore/build";
import {ReaderStateCommand} from "../commands/ReaderStateCommand";
import {Client, ReaderStateEvent} from "../events/ReaderStateEvent";

require('dotenv').config()

export class ReaderPresentedHandler implements ICommandHandler<ReaderStateCommand, ReaderStateEvent> {

    async execute(command: ReaderStateCommand): Promise<ReaderStateEvent> {
        const client: Client = {
            app: "", socket: "", user: ""

        }
        const event: ReaderStateEvent = {
            client: command.client,
            reader_id: command.reader_id,
            transaction: command.transaction,
            date: new Date(),
            type: EventType.READER_PRESENCE_REQUESTED
        }
        return event;
    }


}