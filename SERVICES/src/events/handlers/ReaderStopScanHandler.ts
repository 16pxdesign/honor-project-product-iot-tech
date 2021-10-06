import {EventType, ICommandHandler } from "../../../../escore/build";
import {ReaderStateCommand} from "../commands/ReaderStateCommand";
import {ReaderStateEvent} from "../events/ReaderStateEvent";

require('dotenv').config()

export class ReaderStopScanHandler implements ICommandHandler<ReaderStateCommand, ReaderStateEvent> {

    async execute(command: ReaderStateCommand): Promise<ReaderStateEvent> {
        const event: ReaderStateEvent = {
            client: command.client,
            reader_id: command.reader_id,
            transaction: command.transaction,
            date: new Date(),
            type: EventType.READER_REQUESTED_STOP
        }
        return event;
    }


}