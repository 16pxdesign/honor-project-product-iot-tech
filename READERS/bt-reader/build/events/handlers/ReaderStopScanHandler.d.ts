import { ICommandHandler } from "../../../../escore/build";
import { ReaderStateCommand } from "../commands/ReaderStateCommand";
import { ReaderStateEvent } from "../events/ReaderStateEvent";
export declare class ReaderStopScanHandler implements ICommandHandler<ReaderStateCommand, ReaderStateEvent> {
    execute(command: ReaderStateCommand): Promise<ReaderStateEvent>;
}
